from django.db import models


class NetParamsModel(models.Model):
    username = models.CharField(max_length=50)
    training_size = models.FloatField()
    loss = models.IntegerField()
    optimizer = models.IntegerField()
    lr = models.FloatField()
    wd = models.FloatField()
    epochs = models.PositiveIntegerField()
    batch = models.PositiveIntegerField()
    layers = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
