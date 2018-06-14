# -*- coding: utf-8 -*-
from django.conf import settings
import cognitive_sr
import io
from typing import Dict


def criar_perfil() -> str:
    """
    Cria um novo perfil junto a API de reconhecimento de voz da Microsoft.

    :return: id do perfil criado
    :rtype: str
    """
    speaker_verification = cognitive_sr.SpeechIdentification(settings.AZURE_SPEAKER_REC_KEY)
    result = speaker_verification.create_profile()
    return result


def treinar_reconhecimento(profile_id: str, wav_file: io.BytesIO) -> Dict:
    """
    Envia o áudio para treinamento de um perfil

    :param str profile_id: id do perfil que será treinado
    :param io.BytesIO wav_file: Arquivo contendo gravação
    :return: Dicionário contendo dados retornados pela Microsoft
    :rtype: Dict
    """
    wav_file.seek(0)
    wav_data = wav_file.read()

    speaker_verification = cognitive_sr.SpeechVerification(settings.AZURE_SPEAKER_REC_KEY)
    result = speaker_verification.enroll_profile(profile_id, wav_data)
    return result


def verificar(profile_id: str, wav_file: io.BytesIO) -> Dict:
    """
    Recebe um áudio em formato wav e realiza o teste de identidade jutno à Microsoft.

    :param str profile_id: id o perfil à ser verificado
    :param io.BytesIO wav_file: Arquivo contendo os dados wav
    :return: Dicionário retornado pela Microsoft
    :rtype: Dict
    """
    wav_file.seek(0)
    wav_data = wav_file.read()

    speaker_verification = cognitive_sr.SpeechVerification(settings.AZURE_SPEAKER_REC_KEY)
    result = speaker_verification.verify_profile(profile_id, wav_data)
    return result
