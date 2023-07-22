from backend.api import _get_token_balances, _add_addresses_to_swaps


def test_get_balances():
    ff = _get_token_balances("0xCCBF1C9038D202a50B1dAd88134D47275CB213EF".lower())

    assert ff


def test_add_addresses_to_swaps():
    swaps = [
        {"token_in": "WETH", "token_out": "1INCH"},
        {"token_in": "USDC", "token_out": "DAI"},
    ]
    _add_addresses_to_swaps(swaps)

    assert swaps
