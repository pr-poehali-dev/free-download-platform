import json
import os
import base64
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления каталогом игр'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute("""
                SELECT id, title, genre, rating, image_url, trailer_url, 
                       description, release_date, created_at
                FROM games 
                ORDER BY created_at DESC
            """)
            games = cur.fetchall()
            
            result = []
            for game in games:
                result.append({
                    'id': game['id'],
                    'title': game['title'],
                    'genre': game['genre'],
                    'rating': float(game['rating']) if game['rating'] else 0,
                    'image': game['image_url'],
                    'trailer': game['trailer_url'] or '',
                    'description': game['description'],
                    'releaseDate': game['release_date']
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            image_url = data.get('image')
            if data.get('imageFile'):
                s3 = boto3.client('s3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
                )
                
                image_data = base64.b64decode(data['imageFile'].split(',')[1])
                file_ext = data.get('imageType', 'jpg')
                file_key = f"games/{datetime.now().timestamp()}.{file_ext}"
                
                s3.put_object(
                    Bucket='files',
                    Key=file_key,
                    Body=image_data,
                    ContentType=f'image/{file_ext}'
                )
                
                image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
            
            cur.execute("""
                INSERT INTO games (title, genre, rating, image_url, trailer_url, description, release_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data['title'],
                data['genre'],
                data['rating'],
                image_url,
                data.get('trailer', ''),
                data['description'],
                data['releaseDate']
            ))
            
            game_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': game_id, 'message': 'Game created'})
            }
        
        elif method == 'DELETE':
            game_id = event.get('queryStringParameters', {}).get('id')
            if not game_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Game ID required'})
                }
            
            cur.execute("DELETE FROM games WHERE id = %s", (game_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Game deleted'})
            }
        
        cur.close()
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
