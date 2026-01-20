"""Hello unit test module."""

from apps/recommendation_service.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello apps/recommendation-service"
