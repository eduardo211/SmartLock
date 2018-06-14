from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from . import speaker_rec


class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ms_profile_id = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return 'Perfil de ' + self.user.get_full_name()

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfis'


@receiver(post_save,sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created is True:
        Perfil.objects.create(user=instance,
                              ms_profile_id=speaker_rec.criar_perfil())


class Fechadura(models.Model):
    nome = models.CharField(max_length=100)
    ip = models.GenericIPAddressField(protocol='ipv4')    
    
    def __str__(self):
        return self.nome
