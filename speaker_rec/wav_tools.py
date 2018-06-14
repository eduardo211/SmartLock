# -*- coding: utf-8 -*-
from django.core.files.uploadedfile import InMemoryUploadedFile
import wave
import io
import audioop


def process_wav(file: InMemoryUploadedFile, outrate: int=16000, outchannels: int=1) -> io.BytesIO:
    """
    Recebe um objeto similar a um arquivo e converte esse arquivo para o formato solicitado pelas APIs da Microsoft.

    :param InMemoryUploadedFile file: Arquivo wave de entrada
    :param int outrate: Taxa de amostragem do arquivo de saída
    :param int outchannels: Número de canais de áudio na saída
    :return: Arquivo no formato solicitado pelas APIs da Microsoft
    :rtype: io.BytesIO
    """
    wav_reader = wave.open(file)
    n_frames = wav_reader.getnframes()
    sample_width = wav_reader.getsampwidth()
    n_channles = wav_reader.getnchannels()
    sample_rate = wav_reader.getframerate()
    comptype = wav_reader.getcomptype()
    compname = wav_reader.getcompname()
    data = wav_reader.readframes(n_frames)

    # Verifica se será necessário converter o sample rate
    if sample_rate > outrate:
        data = (audioop.ratecv(data, sample_width, n_channles, sample_rate, outrate, None))[0]

    if n_channles > outchannels:
        data = (audioop.tomono(data, sample_width, 0.5, 0.5))

    outfile = io.BytesIO()
    wav_write = wave.open(outfile, 'wb')
    wav_write.setnchannels(outchannels)
    wav_write.setframerate(outrate)
    wav_write.setsampwidth(sample_width)
    wav_write.setcomptype(comptype, compname)
    wav_write.writeframes(data)
    outfile.seek(0)
    return outfile
