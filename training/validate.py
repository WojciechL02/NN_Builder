import torch
from torch.nn.functional import l1_loss
from sklearn.metrics import recall_score, precision_score, f1_score, accuracy_score, r2_score, mean_squared_error


def validate_classif(model, loader, criterion):
    model.eval()
    total_loss = 0.
    metrics = {
        'Accuracy': 0.,
        'Recall': 0.,
        'Precision': 0.,
        'F1-score': 0.,
    }

    with torch.no_grad():
        for data, target in loader:
            logits = model(data)
            total_loss += criterion(logits, target).item()
            pred = logits.argmax(dim=1, keepdim=True)

            metrics['Accuracy'] += accuracy_score(target, pred)
            metrics['Recall'] += recall_score(target, pred, zero_division=0)
            metrics['Precision'] += precision_score(target, pred, zero_division=0)
            metrics['F1-score'] += f1_score(target, pred, zero_division=0)

    metrics = {k: round(v / len(loader), 4) for k, v in metrics.items()}
    loss = round(total_loss / len(loader), 4)
    return loss, metrics


def validate_regr(model, loader, criterion):
    model.eval()
    total_loss = 0.
    metrics = {
        'MAE': 0.,
        'MSE': 0.,
        'R2': 0.,
        'RMSE': 0.,
    }

    with torch.no_grad():
        for data, target in loader:
            logits = model(data)
            target = target.unsqueeze(1).float()
            total_loss += criterion(logits, target).item()

            metrics['MAE'] += l1_loss(target, logits).item()
            metrics['MSE'] += criterion(target, logits).item()
            metrics['R2'] += r2_score(target, logits)
            metrics['RMSE'] += mean_squared_error(target, logits, squared=False)

    metrics = {k: round(v / len(loader), 3) for k, v in metrics.items()}
    loss = round(total_loss / len(loader), 4)
    return loss, metrics
