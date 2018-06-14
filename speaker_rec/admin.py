from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin

from . models import Perfil, Fechadura


class PerfilInline(admin.StackedInline):
    model = Perfil
    max_num = 1
    can_delete = False


class UserAdmin(AuthUserAdmin):
    inlines = [PerfilInline]


admin.site.unregister(User)
admin.site.register(Fechadura)
admin.site.register(User, UserAdmin)
