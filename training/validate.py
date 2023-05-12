import torch


def validate_model(model, loader, criterion, task, metric_functions):
    model.eval()
    total_loss = 0.
    metrics = {}

    with torch.no_grad():
        for data, target in loader:
            logits = model(data)

            total_loss += criterion(logits, target).item()

            if task == 'C':
                pred = logits.argmax(dim=1, keepdim=True)
                for name, metric in metric_functions:
                    metrics[name] += metric(target, pred)

    metrics = {k: v / len(loader) for k, v in metrics.items()}
    loss = total_loss / len(loader)
    return loss, metrics
