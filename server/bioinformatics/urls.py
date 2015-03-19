from django.conf.urls import patterns, url
from django.conf.urls.static import static
from bioinformatics import views
from django.conf import settings

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^workflow/(?P<workflow_id>\d+)$', views.workflow, name='workflow'),
    url(r'^category/(?P<category_id>\d+)$', views.category, name='category'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

print settings.STATIC_ROOT