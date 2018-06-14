from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Perfil, Fechadura
from . import speaker_rec
from . import wav_tools
from . import coap


@login_required
def fechaduras(request):
    return render(request, 'speaker_rec/fechaduras.html', {
        'fechaduras': Fechadura.objects.all()
    })


@login_required
def fechadura_cadastro(request):
    return render(request, 'speaker_rec/enroll.html', {

    })


@login_required
def fechadura(request):
    f_id = request.GET.get('f_id')
    f = Fechadura.objects.get(pk=f_id)
    
    if coap.fechadura_aberta(f.ip):
        estado = 'aberta'
    else:
        estado = 'fechada'
    
    return render(request, 'speaker_rec/fechadura.html', {
        'f': f,
        'estado_fechadura': estado
    })


class AuthenticateView(View,
                       LoginRequiredMixin):
    raise_exception = True

    def post(self, request: HttpRequest):
        current_user = request.user
        profile_id = Perfil.objects.get(user=current_user).ms_profile_id
        # perfl_junio = 'ebb68328-3c88-4ee8-9ef6-009a37da451e'

        audio_file = request.FILES['audio']
        res = speaker_rec.verificar(profile_id, wav_tools.process_wav(audio_file))

        data = {}

        #res['result'] = 'Accept'

        if res.get('result') is not None:
            if res.get('result') == 'Accept':
                f_id = request.POST.get('f_id')
                f = Fechadura.objects.get(pk=f_id)
                coap.abrir_fechadura(f.ip)
                data['res'] = 'ok'
            else:
                data['res'] = 'error'
        else:
            data['res'] = 'error'

        return JsonResponse(data)


class EnrollView(View,
                 LoginRequiredMixin):
    raise_exception = True

    def post(self, request: HttpRequest):
        current_user = request.user
        profile_id = Perfil.objects.get(user=current_user).ms_profile_id

        audio_file = request.FILES['audio']
        res = speaker_rec.verificar(profile_id, wav_tools.process_wav(audio_file))

        return JsonResponse(res)


class FecharView(View,
                 LoginRequiredMixin):

    raise_exception = True

    def post(self, request: HttpRequest):
        f_id = request.POST.get('f_id')
        f = Fechadura.objects.get(pk=f_id)

        coap.fechar_fechadura(f.ip)

        return JsonResponse({'res': 'ok'})

