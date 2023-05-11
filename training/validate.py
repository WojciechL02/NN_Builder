import torch


def validate_model(model, loader, criterion):
    model.eval()
    total_loss = 0.
    correct = 0
    n_samples = 0

    with torch.no_grad():
        for data, target in loader:
            logits = model(data)

            total_loss += criterion(logits, target).item()
            pred = logits.argmax(dim=1, keepdim=True)

            correct += pred.eq(target.view_as(pred)).sum().item()
            n_samples += len(data)

    loss = total_loss / len(loader)
    accuracy = correct / n_samples
    return loss, accuracy
