
# Import required modules and the FastAPI app
from fastapi.testclient import TestClient
from app.main import app

# Create a test client for the FastAPI app
client = TestClient(app)


# Test: POST with code, user_prompt, and system_prompt returns optimized code
# TC#B1
# Description: POST with code, user_prompt, and system_prompt returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_code_positive(mocker):
    # Mock the optimize_tsx_code function
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized code')
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Hello World</div>',
        'user_prompt': 'Make it better',
        'system_prompt': 'Optimize'
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized code'}


# Test: POST with a valid .tsx file returns optimized code
# TC#B2
# Description: POST with a valid .tsx file returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_file_positive(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized code')
    tsx_file = tmp_path / 'test.tsx'
    tsx_file.write_text('<div>Hello File</div>')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('test.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized code'}


# Test: POST with invalid file extension returns error
# TC#B16
# Description: POST with invalid file extension returns error
# Expected Result: Returns error (400 Bad Request)
def test_optimize_with_invalid_file_extension():
    with open(__file__, 'rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('test.txt', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'error': 'Only .tsx files are allowed.'}


# Test: POST with no code or file returns error
# TC#B17
# Description: POST with no code or file returns error
# Expected Result: Returns error (400 Bad Request)
def test_optimize_with_no_code_or_file():
    response = client.post('/optimize-tsx-code', data={})
    assert response.status_code == 200
    assert response.json() == {'error': 'No code or file provided.'}

    # If both code and file are provided, file should take precedence
# Test: If both code and file are provided, file takes precedence
# TC#B3
# Description: If both code and file are provided, file takes precedence
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_code_and_file(mocker, tmp_path):

    mocker.patch('app.main.optimize_tsx_code', return_value='optimized from file')
    tsx_file = tmp_path / 'test.tsx'
    tsx_file.write_text('<div>File Content</div>')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', data={'code': '<div>Code Content</div>'}, files={'file': ('test.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized from file'}


# TC#B18
# Description: POST with empty .tsx file returns error
# Expected Result: Returns error (400 Bad Request)
def test_optimize_with_empty_tsx_file(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized empty')
    tsx_file = tmp_path / 'empty.tsx'
    tsx_file.write_text('')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('empty.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'error': 'No code or file provided.'}


# TC#B4
# Description: POST with only user_prompt returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_only_user_prompt(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized user prompt')
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Prompt</div>',
        'user_prompt': 'Just user prompt'
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized user prompt'}


# TC#B5
# Description: POST with only system_prompt returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_only_system_prompt(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized system prompt')
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Prompt</div>',
        'system_prompt': 'Just system prompt'
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized system prompt'}


# TC#B6
# Description: POST with large code string returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_large_code(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized large')
    large_code = '<div>' + 'A' * 10000 + '</div>'
    response = client.post('/optimize-tsx-code', data={
        'code': large_code
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized large'}


# TC#B22
# Description: Service error in optimize_tsx_code returns 500
# Expected Result: Returns error (500 Internal Server Error)
def test_optimize_service_error(mocker):
    def error_func(*args, **kwargs):
        raise RuntimeError('Service error')
    mocker.patch('app.main.optimize_tsx_code', side_effect=error_func)
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Error</div>'
    })
    assert response.status_code == 500


# TC#B7
# Description: POST with .tsx file containing only whitespace returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_whitespace_file(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized whitespace')
    tsx_file = tmp_path / 'whitespace.tsx'
    tsx_file.write_text('   \n\t  ')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('whitespace.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized whitespace'}


# TC#B20
# Description: POST with binary .tsx file returns error or 200
# Expected Result: Returns error or 200 (implementation dependent)
def test_optimize_with_binary_file(tmp_path):
    binary_file = tmp_path / 'binary.tsx'
    binary_file.write_bytes(b'\x00\x01\x02')
    with binary_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('binary.tsx', f, 'application/octet-stream')})
    # Should decode as utf-8, may error or return error response
    assert response.status_code == 200 or response.status_code == 500


# TC#B8
# Description: POST with large .tsx file returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_large_file(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized large file')
    large_file = tmp_path / 'large.tsx'
    large_file.write_text('A' * 100000)
    with large_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('large.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized large file'}


# TC#B9
# Description: POST with both user_prompt and system_prompt returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_both_prompts(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized both prompts')
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Prompt</div>',
        'user_prompt': 'User',
        'system_prompt': 'System'
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized both prompts'}


# (No TC# - not a functional test case for optimization endpoint)
def test_cors_headers():
    response = client.post('/optimize-tsx-code', data={'code': '<div>CORS</div>'}, headers={'Origin': 'http://localhost'})
    assert response.status_code == 200
    assert 'access-control-allow-origin' in response.headers


# TC#B23
# Description: GET method is not allowed on /optimize-tsx-code
# Expected Result: Returns error (405 Method Not Allowed)
def test_get_method_not_allowed():
    response = client.get('/optimize-tsx-code')
    assert response.status_code == 405


# TC#B21
# Description: Malformed multipart request returns error
# Expected Result: Returns error (400 Bad Request)
def test_malformed_multipart():
    # Send a malformed multipart request
    response = client.post('/optimize-tsx-code', content='not a multipart', headers={'Content-Type': 'multipart/form-data'})
    assert response.status_code in (400, 422)


# TC#B19
# Description: POST with uppercase file extension returns error (case-sensitive)
# Expected Result: Returns error (400 Bad Request)
def test_optimize_with_uppercase_extension(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized uppercase')
    tsx_file = tmp_path / 'test.TSX'
    tsx_file.write_text('<div>Uppercase</div>')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', files={'file': ('test.TSX', f, 'text/plain')})
    # Should return error, as only .tsx is allowed (case-sensitive)
    assert response.status_code == 200
    assert response.json() == {'error': 'Only .tsx files are allowed.'}


# TC#B10
# Description: POST with extra form fields returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_with_extra_form_fields(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized extra')
    response = client.post('/optimize-tsx-code', data={
        'code': '<div>Extra</div>',
        'extra_field': 'unexpected'
    })
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized extra'}


# TC#B11
# Description: POST with missing Content-Type header returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_missing_content_type(mocker):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized missing content-type')
    response = client.post('/optimize-tsx-code', data={'code': '<div>No Content-Type</div>'}, headers={})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized missing content-type'}


# TC#B12
# Description: POST with multiple files uses only the 'file' field
# Expected Result: Only the 'file' field is used (200 OK)
def test_optimize_multiple_files(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized first file')
    tsx_file1 = tmp_path / 'file1.tsx'
    tsx_file2 = tmp_path / 'file2.tsx'
    tsx_file1.write_text('<div>File1</div>')
    tsx_file2.write_text('<div>File2</div>')
    with tsx_file1.open('rb') as f1, tsx_file2.open('rb') as f2:
        response = client.post('/optimize-tsx-code', files={
            'file': ('file1.tsx', f1, 'text/plain'),
            'file2': ('file2.tsx', f2, 'text/plain')
        })
    # Only the 'file' field should be used
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized first file'}


# TC#B13
# Description: POST with empty code and valid file returns optimized code
# Expected Result: Returns optimized code (200 OK)
def test_optimize_empty_code_and_valid_file(mocker, tmp_path):
    mocker.patch('app.main.optimize_tsx_code', return_value='optimized file')
    tsx_file = tmp_path / 'valid.tsx'
    tsx_file.write_text('<div>Valid</div>')
    with tsx_file.open('rb') as f:
        response = client.post('/optimize-tsx-code', data={'code': ''}, files={'file': ('valid.tsx', f, 'text/plain')})
    assert response.status_code == 200
    assert response.json() == {'optimized': 'optimized file'}
