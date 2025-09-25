
# Import required modules and the function to test
import pytest
from app.open_router_service import optimize_tsx_code


# Mock response object to simulate OpenRouter API response
class MockResponse:
    class Choice:
        class Message:
            content = 'mock optimized code'  # Simulated optimized code
        message = Message()
    choices = [Choice()]


# Mock client to replace the actual OpenRouter client in tests
class MockClient:
    class Chat:
        class Completions:
            @staticmethod
            def create(**kwargs):
                return MockResponse()  # Always returns the mock response
        completions = Completions()
    chat = Chat()


# Test for successful code optimization
@pytest.mark.asyncio
async def test_optimize_tsx_code_positive(monkeypatch):
    # Patch the OpenRouter client with the mock client
    monkeypatch.setattr('app.open_router_service.client', MockClient())
    # Call the function and check the result
    result = await optimize_tsx_code('<div>Hello</div>', 'system', 'user')
    assert result == 'mock optimized code'


# Test for error handling when the API raises an exception
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
    # Patch the OpenRouter client with the error client
    monkeypatch.setattr('app.open_router_service.client', ErrorClient())
    # Call the function and check that error is handled
    try:
        await optimize_tsx_code('<div>Error</div>')
    except RuntimeError as e:
        assert str(e) == 'API error'
