from django import forms


class UploadFileForm(forms.Form):
    # title = forms.CharField(max_length=50)
    file = forms.FileField()


class NetParamsForm(forms.Form):
    training_size = forms.FloatField(min_value=0., max_value=1.)
    loss = forms.IntegerField(min_value=0)
    optimizer = forms.IntegerField(min_value=0)
    lr = forms.FloatField(min_value=0.)
    wd = forms.FloatField(min_value=0.)
    epochs = forms.IntegerField(min_value=1)
    batch = forms.IntegerField(min_value=1)
    layers = forms.CharField()
