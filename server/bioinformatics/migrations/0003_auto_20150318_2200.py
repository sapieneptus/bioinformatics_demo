# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('bioinformatics', '0002_auto_20150318_2158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='workflows',
            field=django.contrib.postgres.fields.ArrayField(default=[], base_field=models.PositiveIntegerField(), size=None),
            preserve_default=False,
        ),
    ]
