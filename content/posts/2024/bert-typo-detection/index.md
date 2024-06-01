---
title: "使用 PyTorch 和 BertForMaskedLM 偵測錯別字並建議正確用字"
date: 2024-06-01T12:51:12+08:00
draft: false
categories: ["AI"]
tags: ["pytorch", "bert", "typo-detection"]
---

在自然語言處理中，偵測錯別字並提供正確的修正建議是一個重要的任務。本文將介紹如何使用 PyTorch 和 BertForMaskedLM 模型來實現這一功能。我們將使用 BERT 模型進行預訓練，並利用其能力來預測遺漏或錯誤的詞彙。

<!--more-->

# 1. 簡介

在這個實現中，我們將使用 Hugging Face 的 transformers 庫，這是一個廣泛使用的自然語言處理庫，提供了各種預訓練模型和相關工具。

我們將使用 BERT 模型的中文預訓練版本 "bert-base-chinese" 來進行錯別字偵測和修正建議。我們將自定義一個繼承自 BertForMaskedLM 的模型，並在 forward 方法中實現主要的邏輯。

# 2. 實現步驟

以下是我們實現錯別字檢測功能的步驟：

1. **模型建立：** 我們創建一個自定義的 BERT 模型，繼承自 BertForMaskedLM。這個模型的目的是預測每個 token 的概率分佈，用以判斷錯別字（概率較低）及取得建議用字（概率較高）。
2. **資料預處理：** 我們使用 BERT 預訓練模型的 tokenizer 將句子轉換為 token IDs。同時，我們在句子前添加 [UNK] 作為特殊標記，以避免首字被錯誤地判定為錯別字。
3. **錯別字檢測：** 我們遍歷每個 token，比較原始 token 和預測 token 是否相同。如果不同，我們將其視為錯別字。我們還計算了每個 token 的概率，以便後續建議正確用字。
4. **結果呈現：** 我們將錯別字的位置、原始字符、預測字符和其概率列出，以便用戶查看。

## 2.1. 庫安裝

首先，確保你已經安裝了 transformers 庫。可以使用以下命令進行安裝：

```sh
pip install transformers
```

## 2.2 導入庫和設置參數

我們首先導入所需的庫，並設置一些參數。

```py
from transformers import AutoTokenizer, BertConfig, BertForMaskedLM
from torch import nn, topk, multiply
import torch

seq_length = 128
pretrained_model_name = "bert-base-chinese"

tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name)
vocab_size = tokenizer.vocab_size
```

在這裡，我們使用 AutoTokenizer 從預訓練模型中創建一個 tokenizer。 `vocab_size` 表示模型的詞彙總數。句子的最大可接受長度 `seq_length` 是 128 個 token（詞彙）。

## 2.3. 自定義模型

接下來，我們自定義一個繼承自 BertForMaskedLM 的模型，並重寫其中的 forward 方法。

```py
class MyModel(BertForMaskedLM):
    def forward(self, input_ids, attention_mask, token_type_ids):
        attentions = super().forward(input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids, labels=input_ids)
        probs = nn.Softmax(-1)(attentions.logits)
        predict_probs, predict_ids = topk(probs, 1)
        input_probs, _ = torch.max(multiply(probs, nn.functional.one_hot(input_ids, vocab_size)), 2)
        return input_ids, input_probs, predict_ids, predict_probs

model = MyModel.from_pretrained(pretrained_model_name)
```

在這個自定義模型中，我們調用了 BertForMaskedLM 的 `forward` 方法，並通過計算輸入序列的注意力、預測概率和預測詞彙等來擴展其功能。以下是這個模型的 `forward` 方法各個步驟的解釋：

1. **BertForMaskedLM 的 forward 方法：** 在 MyModel 的 `forward` 方法中，首先調用了 BertForMaskedLM 的 `forward` 方法，傳遞了 `input_ids`、`attention_mask`、`token_type_ids` 和 `labels`。這將觸發 BERT 模型的正向傳遞運算，該運算會生成預測的詞彙概率。
2. **Softmax 轉換：** 獲得 BERT 模型的輸出後，將詞彙概率 `attentions.logits` 通過 Softmax 函數進行轉換，以獲得正規化的概率分佈。這一步將確保每個詞彙的概率值在 0 到 1 之間，並且總和為 1。
3. **預測概率和預測詞彙的選取：** 使用 `topk` 函數，從正規化的概率分佈中選取概率最高的詞彙。在這個例子中，選取了概率最高的一個詞彙作為預測的詞彙，並獲得對應的概率值。
4. **輸入詞彙的概率計算：** 通過使用 `nn.functional.one_hot` 將 `input_ids` 轉換為 one-hot 表示，然後將之與正規化的概率分佈進行乘法運算，得到輸入詞彙在概率分佈中的相應概率值。這一步的目的是獲取模型對於輸入詞彙的預測概率。
5. **返回結果：** `forward` 方法返回四個值：`input_ids` 是原始的輸入詞彙 ID 序列，`input_probs` 是模型對於輸入詞彙的預測概率，`predict_ids` 是預測的詞彙 ID，`predict_probs` 是預測詞彙的概率值。

## 2.4. 偵測錯別字並提供建議

現在，我們可以定義一個函數 `detect_typo` 來偵測錯別字並提供修正建議。

```py
def detect_typo(strings):
    prefix = "[UNK]"
    input_strings = [ f"{prefix}{sentence}" for sentence in strings]
    batch_encoding = tokenizer(input_strings, padding='max_length', max_length=seq_length, return_tensors="pt")
    input_ids, input_probs, predict_ids, predict_probs = model(**batch_encoding)

    results = []
    for batch_idx, input_tokens in enumerate(input_ids):
        for token_idx, input_token in enumerate(input_tokens):
            if input_token == tokenizer.sep_token_id: break
            if input_token == tokenizer.cls_token_id: continue
            if input_token == tokenizer.unk_token_id: continue
            predict_token = predict_ids[batch_idx][token_idx]
            if predict_token in tokenizer.all_special_ids: continue
            if input_token != predict_token:
                input_prob   = input_probs[batch_idx][token_idx].item()
                predict_prob = predict_probs[batch_idx][token_idx].item()
                input_char   = tokenizer.decode(input_token)
                predict_char = tokenizer.decode(predict_token)
                token_start, token_end = batch_encoding.token_to_chars(batch_idx, token_idx)
                token_start = token_start - len(prefix)
                token_end = token_end - len(prefix)
                results.append({
                    "start": token_start,
                    "end": token_end,
                    "origin": input_char,
                    "origin_prob": input_prob,
                    "predict": predict_char,
                    "predict_prob": predict_prob,
                })
    return results
```

在這個函數中，我們首先在每個句子前添加了 [UNK]，這是為了避免首字被錯誤地判定為錯別字並建議使用 "。" 的問題。然後，我們使用 tokenizer 將句子轉換為模型所需的輸入張量。接著，我們通過調用自定義模型的 `forward` 方法，獲取輸入序列的原始詞彙、原始詞彙概率、預測詞彙和預測詞彙概率。

> BertForMaskedLM 是一個基於 BERT 模型的語言模型，用於預測遮蔽（mask）的詞彙。當使用這個模型時，原句子的第一個字無論是甚麼，其概率通常會較低，而被預測為「。」的概率則較高。
>
> 這是因為在預訓練 BERT 時使用的訓練數據中，句子的開頭常常是以句點「。」或其他類似的標點符號結束。因此，模型在處理這種類型的句子時，經常遇到以句點結束的上下文。這種觀察在訓練過程中被模型學習到，導致模型傾向於預測句點作為開頭的可能性較高。
>
> 由於 BERT 是一種上下文敏感的模型，這種偏好可能在預測時產生影響，導致模型偏向選擇「。」作為開頭的預測結果。
>
> 需要注意的是，這種行為可能會因具體的 BERT 模型、訓練數據和任務特定的微調方式而有所不同。因此，具體的概率值可能會有所變化，但觀察到的趨勢通常是第一個字的概率較低，而「。」的概率較高。

最後，我們遍歷輸入序列中的每個詞彙，檢查是否有錯別字。如果有，我們收集相關信息，如錯誤詞彙的位置、原始詞彙、原始詞彙概率、建議的正確詞彙以及建議詞彙的概率。

# 3. 執行錯別字偵測和修正

現在，我們可以使用 `detect_typo` 函數來執行錯別字偵測和修正：

```py
results = detect_typo(["沒有情緒就不會被嘞索，沒有道德就不會被綁架。"])
print(results)
```

在這個示例中，我們將一個句子作為輸入傳遞給 `detect_typo` 函數，並打印出偵測到的錯別字和修正建議。結果如下：

```py
[{'start': 8, 'end': 9, 'origin': '嘞', 'origin_prob': 1.4988561503059827e-08, 'predict': '勒', 'predict_prob': 0.9008431434631348}]
```

在這句話中，第9個字「嘞」被判定為錯別字。根據模型的預測，建議將該字替換為「勒」。原始詞彙「嘞」的概率非常低（約為 1.5e-08），而建議詞彙「勒」的概率則非常高（約為 0.901）。

這個結果顯示出在給定的句子中，模型能夠成功地偵測到錯別字並提供了合理的修正建議。

# 4. 結論

本文介紹了如何使用 PyTorch 和 BertForMaskedLM 模型來實現錯別字偵測和修正建議的功能。通過使用預訓練的 BERT 模型，我們能夠利用其強大的語言建模能力來預測遺漏或錯誤的詞彙。這種方法對於語言處理應用中的錯別字修正和文字校對等任務非常有用。

希望本文能幫助你理解如何使用 PyTorch 和 BertForMaskedLM 來實現錯別字偵測和修正建議的功能。如果你有任何問題或建議，請隨時在下方留言。
