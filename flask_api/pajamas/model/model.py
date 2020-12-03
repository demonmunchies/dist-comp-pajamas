from flask import current_app, _app_ctx_stack
from transformers import BertForTokenClassification, BertTokenizer
import torch
import numpy as np


class BertTK(object):
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        model_path = app.config.get('MODEL_PATH', '.')
        self.model = BertForTokenClassification.from_pretrained(model_path)
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-cased', do_lower_case=True)
        self.tag_values = ['None', 'task_name', 'PAD']

    def predict(self, text):
        tokenized_sentence = self.tokenizer.encode(text)
        input_ids = torch.tensor([tokenized_sentence])

        with torch.no_grad():
            output = self.model(input_ids)
        label_indices = np.argmax(output[0].to('cpu').numpy(), axis=2)

        tokens = self.tokenizer.convert_ids_to_tokens(input_ids.to('cpu').numpy()[0])
        new_tokens, new_labels = [], []
        for token, label_idx in zip(tokens, label_indices[0]):
            if token.startswith("##"):
                new_tokens[-1] = new_tokens[-1] + token[2:]
            else:
                new_labels.append(self.tag_values[label_idx])
                new_tokens.append(token)
        return new_tokens, new_labels
