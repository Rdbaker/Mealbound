# -*- coding: utf-8 -*-
"""Test the swagger docs."""


class TestSwagger:
    """Swagger docs tests."""

    def test_swagger_spec(self, testapp):
        """Test that we get a 200 from /swagger/spec."""
        res = testapp.get('/api/v1/spec')
        assert res.status_code == 200

    def test_swagger_docs(self, testapp):
        """Test that we get a 200 from /swagger/docs."""
        res = testapp.get('/api/v1/docs')
        assert res.status_code == 200
