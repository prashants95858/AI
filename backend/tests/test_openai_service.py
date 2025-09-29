
# Import required modules and the function to test
import pytest
from app.openai_service import optimize_tsx_code


# Mock response object to simulate OpenAI API response
class MockResponse:
    class Choice:
        class Message:
            content = 'mock optimized code'  # Simulated optimized code
        message = Message()
    choices = [Choice()]


# Mock client to replace the actual OpenAI client in tests
class MockClient:
    class Chat:
        class Completions:
            @staticmethod
            def create(**kwargs):
                return MockResponse()  # Always returns the mock response
        completions = Completions()
    chat = Chat()


    # TC#B14
    # Description: Test for successful code optimization (OpenAI)
    # Expected Result: Returns optimized code (200 OK)
@pytest.mark.asyncio
async def test_optimize_tsx_code_positive(monkeypatch):
    # Patch the OpenAI client with the mock client
    monkeypatch.setattr('app.openai_service.client', MockClient())
    # Call the function and check the result
    result = await optimize_tsx_code('<div>Hello</div>', 'system', 'user')
    assert result == 'mock optimized code'


    # TC#B24
    # Description: Test for error handling when the API raises an exception (OpenAI)
    # Expected Result: Returns error (500 Internal Server Error)
@pytest.mark.asyncio
async def test_optimize_tsx_code_negative(monkeypatch):
    # Mock client that raises an error when called
    class ErrorClient:
        class Chat:
            class Completions:
                @staticmethod
                def create(**kwargs):
                    raise RuntimeError('API error')  # Simulate API error
            completions = Completions()
        chat = Chat()
    # Patch the OpenAI client with the error client
    monkeypatch.setattr('app.openai_service.client', ErrorClient())
    # Call the function and check that error is handled
    result = await optimize_tsx_code('<div>Error</div>')
    assert result.startswith('Error: API error')
