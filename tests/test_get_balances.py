from backend.api import _get_token_balances


def test_get_balances():
    ff = _get_token_balances("0xCCBF1C9038D202a50B1dAd88134D47275CB213EF".lower())

    assert ff
