# -*- coding: utf-8 -*-
from coapthon.client.helperclient import HelperClient


def fechadura_aberta(host: str):
    client = HelperClient(server=(host, 5683))
    res = client.get('lightled')
    return res.payload == '0'


def fechar_fechadura(host: str):
    client = HelperClient(server=(host, 5683))
    res = client.post('lightled', '1')


def abrir_fechadura(host: str):
    client = HelperClient(server=(host, 5683))
    res = client.post('lightled', '0')
