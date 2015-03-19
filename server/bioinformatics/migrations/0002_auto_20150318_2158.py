# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('bioinformatics', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='workflows',
            field=django.contrib.postgres.fields.ArrayField(null=True, base_field=models.PositiveIntegerField(), size=None),
        ),
    ]
