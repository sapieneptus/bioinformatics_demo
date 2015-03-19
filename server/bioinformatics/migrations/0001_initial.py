# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_on', models.DateTimeField(auto_now_add=True, verbose_name=b'created on')),
                ('description', models.CharField(max_length=4096)),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name=b'last updated')),
                ('name', models.CharField(unique=True, max_length=256)),
                ('workflows', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), size=None)),
            ],
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('categories', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), size=None)),
                ('created_on', models.DateTimeField(auto_now_add=True, verbose_name=b'created on')),
                ('description', models.CharField(max_length=4096)),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name=b'last updated')),
                ('name', models.CharField(unique=True, max_length=256)),
                ('num_steps', models.PositiveIntegerField(default=1)),
            ],
        ),
    ]
