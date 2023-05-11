import pandas as pd
import torch
from torch.utils.data import Dataset


class CSVDataset(Dataset):
    def __init__(self, csv_file_path) -> None:
        self._data = pd.read_csv(csv_file_path)

    def __len__(self):
        return len(self._data)

    def __getitem__(self, idx):
        x = torch.tensor(self._data.drop(['target'], axis=1).values, dtype=torch.float)
        y = torch.tensor(self._data['target'])
        return x, y
