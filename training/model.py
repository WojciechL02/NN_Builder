import torch.nn as nn


class Network(nn.Module):
    def __init__(self, layers_params: list) -> None:
        super(Network, self).__init__()
        self._layers = nn.ModuleList()

        for i, layer in enumerate(layers_params, 1):
            self._layers.append(nn.Linear(layer['input'], layer['output']))
            if i < len(layers_params):
                self._layers.append(nn.ReLU())

    def forward(self, x):
        y = x
        for layer in self._layers:
            y = layer(y)
        return y
