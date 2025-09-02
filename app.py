#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chinese Dictionary Query Web Application
汉语词典查询网站

A Flask web application for querying Chinese characters from the SQLite database.
Support searching by character, pinyin, Wubi, radical, and other criteria.
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import os
from typing import List, Dict, Any, Optional

app = Flask(__name__)

# Configuration
DATABASE_PATH = '字典20880条数据.db'
ITEMS_PER_PAGE = 50

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def search_characters(query: str, search_type: str = 'zi', page: int = 1) -> Dict[str, Any]:
    """
    Search characters in the database
    
    Args:
        query: Search query string
        search_type: Type of search ('zi', 'pinyin', 'wubi', 'bushou', 'unicode')
        page: Page number for pagination
    
    Returns:
        Dictionary containing search results and pagination info
    """
    conn = get_db_connection()
    
    # Calculate offset for pagination
    offset = (page - 1) * ITEMS_PER_PAGE
    
    # Build SQL query based on search type
    if search_type == 'zi':
        sql = "SELECT * FROM httpcn_zi WHERE zi LIKE ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE zi LIKE ?"
        params = [f'%{query}%', ITEMS_PER_PAGE, offset]
        count_params = [f'%{query}%']
    elif search_type == 'pinyin':
        sql = "SELECT * FROM httpcn_zi WHERE pinyin LIKE ? OR pinyin_toneless LIKE ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE pinyin LIKE ? OR pinyin_toneless LIKE ?"
        params = [f'%{query}%', f'%{query}%', ITEMS_PER_PAGE, offset]
        count_params = [f'%{query}%', f'%{query}%']
    elif search_type == 'wubi':
        sql = "SELECT * FROM httpcn_zi WHERE (wb86 LIKE ? OR wb98 LIKE ?) ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE (wb86 LIKE ? OR wb98 LIKE ?)"
        params = [f'%{query}%', f'%{query}%', ITEMS_PER_PAGE, offset]
        count_params = [f'%{query}%', f'%{query}%']
    elif search_type == 'wb86':
        sql = "SELECT * FROM httpcn_zi WHERE wb86 = ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE wb86 = ?"
        params = [query, ITEMS_PER_PAGE, offset]
        count_params = [query]
    elif search_type == 'zbh':
        sql = "SELECT * FROM httpcn_zi WHERE zbh = ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE zbh = ?"
        params = [int(query), ITEMS_PER_PAGE, offset]
        count_params = [int(query)]
    elif search_type == 'bushou':
        sql = "SELECT * FROM httpcn_zi WHERE bushou = ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE bushou = ?"
        params = [query, ITEMS_PER_PAGE, offset]
        count_params = [query]
    elif search_type == 'unicode':
        sql = "SELECT * FROM httpcn_zi WHERE unicode LIKE ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE unicode LIKE ?"
        params = [f'%{query}%', ITEMS_PER_PAGE, offset]
        count_params = [f'%{query}%']
    elif search_type == 'all':
        # Search across multiple fields including tone-less pinyin
        sql = """SELECT * FROM httpcn_zi 
                 WHERE zi LIKE ? OR pinyin LIKE ? OR pinyin_toneless LIKE ? OR wb86 LIKE ? OR wb98 LIKE ? OR bushou LIKE ? 
                 ORDER BY id LIMIT ? OFFSET ?"""
        count_sql = """SELECT COUNT(*) as total FROM httpcn_zi 
                       WHERE zi LIKE ? OR pinyin LIKE ? OR pinyin_toneless LIKE ? OR wb86 LIKE ? OR wb98 LIKE ? OR bushou LIKE ?"""
        like_query = f'%{query}%'
        params = [like_query, like_query, like_query, like_query, like_query, like_query, ITEMS_PER_PAGE, offset]
        count_params = [like_query, like_query, like_query, like_query, like_query, like_query]
    else:
        # Default to character search
        sql = "SELECT * FROM httpcn_zi WHERE zi LIKE ? ORDER BY id LIMIT ? OFFSET ?"
        count_sql = "SELECT COUNT(*) as total FROM httpcn_zi WHERE zi LIKE ?"
        params = [f'%{query}%', ITEMS_PER_PAGE, offset]
        count_params = [f'%{query}%']
    
    # Get search results
    cursor = conn.execute(sql, params)
    results = [dict(row) for row in cursor.fetchall()]
    
    # Get total count for pagination
    cursor = conn.execute(count_sql, count_params)
    total_count = cursor.fetchone()['total']
    
    conn.close()
    
    # Calculate pagination info
    total_pages = (total_count + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE
    
    return {
        'results': results,
        'current_page': page,
        'total_pages': total_pages,
        'total_count': total_count,
        'items_per_page': ITEMS_PER_PAGE
    }

def get_character_by_id(char_id: int) -> Optional[Dict[str, Any]]:
    """Get detailed character information by ID"""
    conn = get_db_connection()
    cursor = conn.execute("SELECT * FROM httpcn_zi WHERE id = ?", [char_id])
    result = cursor.fetchone()
    conn.close()
    
    if result:
        character = dict(result)
        # Parse image paths
        character['zyybpic_list'] = parse_image_paths(character.get('zyybpic', ''))
        character['xgsf_list'] = parse_image_paths(character.get('xgsf', ''))
        character['kxzdpic_list'] = parse_image_paths(character.get('kxzdpic', ''))
        return character
    return None

def parse_image_paths(image_string: str) -> List[str]:
    """Parse concatenated image paths separated by /Upload/"""
    if not image_string:
        return []
    
    # Handle cases where paths are concatenated with /Upload/ as separator
    # Example: "/Upload/Zy/4E85_1.gif/Upload/Zy/4E85_2.gif"
    
    image_paths = []
    
    # First, split by /Upload/ to get potential paths
    parts = image_string.split('/Upload/')
    
    for i, part in enumerate(parts):
        if not part.strip():
            continue
            
        # For the first part, check if it starts with Upload/ (without leading /)
        if i == 0:
            if part.startswith('Upload/'):
                # This is a valid path starting with Upload/
                image_paths.append('/' + part)
            elif '/' in part and not part.startswith('/'):
                # This might be a partial path, add /Upload/ prefix
                image_paths.append('/Upload/' + part)
        else:
            # For subsequent parts, they should be valid paths after /Upload/
            if part.strip():
                image_paths.append('/Upload/' + part)
    
    # Filter out any invalid paths and ensure they look like image files
    valid_paths = []
    for path in image_paths:
        # Check if path looks like a valid image file
        if (path.endswith(('.gif', '.jpg', '.jpeg', '.png', '.bmp')) and 
            len(path) > 10 and  # Reasonable minimum length
            '/Upload/' in path):
            valid_paths.append(path)
    
    return valid_paths

def get_statistics() -> Dict[str, Any]:
    """Get database statistics"""
    conn = get_db_connection()
    
    # Total characters
    cursor = conn.execute("SELECT COUNT(*) as total FROM httpcn_zi")
    total_chars = cursor.fetchone()['total']
    
    # Top radicals
    cursor = conn.execute("""
        SELECT bushou, COUNT(*) as count 
        FROM httpcn_zi 
        GROUP BY bushou 
        ORDER BY count DESC 
        LIMIT 10
    """)
    top_radicals = [dict(row) for row in cursor.fetchall()]
    
    # Characters by stroke count
    cursor = conn.execute("""
        SELECT zbh, COUNT(*) as count 
        FROM httpcn_zi 
        WHERE zbh <= 20
        GROUP BY zbh 
        ORDER BY zbh
    """)
    stroke_stats = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        'total_characters': total_chars,
        'top_radicals': top_radicals,
        'stroke_statistics': stroke_stats
    }

@app.route('/')
def index():
    """Main page"""
    stats = get_statistics()
    return render_template('index.html', stats=stats)

@app.route('/search')
def search():
    """Search page with results"""
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'zi')
    page = int(request.args.get('page', 1))
    
    if not query:
        return render_template('search.html', results=None, query='', search_type=search_type)
    
    results = search_characters(query, search_type, page)
    return render_template('search.html', 
                         results=results, 
                         query=query, 
                         search_type=search_type)

@app.route('/character/<int:char_id>')
def character_detail(char_id: int):
    """Character detail page"""
    character = get_character_by_id(char_id)
    if not character:
        return "Character not found", 404
    
    return render_template('character.html', character=character)

@app.route('/api/search')
def api_search():
    """API endpoint for search"""
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'zi')
    page = int(request.args.get('page', 1))
    
    if not query:
        return jsonify({'error': 'Query parameter required'}), 400
    
    results = search_characters(query, search_type, page)
    return jsonify(results)

@app.route('/api/character/<int:char_id>')
def api_character(char_id: int):
    """API endpoint for character details"""
    character = get_character_by_id(char_id)
    if not character:
        return jsonify({'error': 'Character not found'}), 404
    
    return jsonify(character)

@app.route('/debug/tts')
def tts_debug():
    """TTS debugging page"""
    return render_template('tts_debug.html')

@app.route('/pinyin-table')
def pinyin_table():
    """Pinyin Syllable Table page"""
    return render_template('pinyin_table.html')

@app.route('/api/stats')
def api_stats():
    """API endpoint for statistics"""
    stats = get_statistics()
    return jsonify(stats)

@app.route('/Upload/<path:filename>')
def uploaded_file(filename):
    """Serve files from Upload directory"""
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Upload')
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    # Check if database exists
    if not os.path.exists(DATABASE_PATH):
        print(f"❌ Database file not found: {DATABASE_PATH}")
        print("Please ensure the SQLite database file is in the same directory as this script.")
        exit(1)
    
    print("🚀 Starting Chinese Dictionary Web Application...")
    print(f"📊 Database: {DATABASE_PATH}")
    print("🌐 Access the website at: http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)