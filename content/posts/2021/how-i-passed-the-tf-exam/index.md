---
title: "關於我如何考取Tensorflow開發者認證"
date: 2021-04-05T15:01:55+08:00
draft: false
categories: ["AI"]
tags: ["tensorflow", "cert", "exam"]
---

幾個月前偶然機會下參加了ML Study Jam 機器學習培訓計劃 2020 這個線上活動，獲得了Tensorflow exam報名補助金(嚴格來說是報銷報名費一次)。對機器學習知曉皮毛而且缺乏TF實戰經驗的我，當然是由零開始學習使用TF，為考試一take pass做好準備。

<!--more-->

基於保密條款，這裡不會提及任何考試內容喔 ~

# 甚麼是Tensorflow Developer Certificate Program

  Tensorflow Developer Certificate計畫主要是通過線上考試驗證開發者的Tensorflow技能，讓合資格者加入他們的認證網絡，並提供一張數碼證書以供個人展示，有效期三年。

  這個考試旨在測試開發者對TF模型的基本構建能力，利用真實數據解決影像分類、自然語言處理、時序預測等問題。你需要懂得如何處理CSV和JSON格式的資料、Data Normalization、Image Augmentation、Text Tokenization，利用`keras`API建立、訓練和儲存模型。

  報名需要提供身分證明如護照、駕照，及每次US$100考試費，付費後6個月內隨時登入並完成考試。詳情可以到[官網](https://www.tensorflow.org/certificate)查看。

# 學習路線該怎麼走

  第一步，去看看官方的[侯選者手冊](https://www.tensorflow.org/extras/cert/TF_Certificate_Candidate_Handbook.pdf)，當中的`Skills checklist`記載著必需要掌握的知識和考核範圍。在學習過程中，我們會就著這個清單內容做[Colab](https://colab.research.google.com/)筆記，確保沒有遺漏，或者記下了不必要的東西。

  第二步，我推薦Udacity的[Intro to TensorFlow for Deep Learning](https://www.udacity.com/course/intro-to-tensorflow-for-deep-learning--ud187)。這是一個免費課程，內容覆蓋了考核範圍，教授的Tensorflow用法比較新而且簡潔，可以很好地掌握絕大部分需要的知識。由於沒有時間限制，我們可以在這裡慢慢打好基礎，細嚼它的Colab notebooks。

  第三步，人人必修的Coursera [DeepLearning.AI TensorFlow Developer Professional Certificate](https://www.coursera.org/professional-certificates/tensorflow-in-practice)。這個課程要價每月US$49，首7日免費，內容同樣覆蓋整個考核範圍，但教授的Tensorflow用法比較舊，畢竟這個課程是比Udacity更早推出的。由於我們已經在上一步學習到了大部分知識，基本上可以跳過教學，直接完成他的測驗。Course 1 & 2需要較多時間去訓練和調整模型，形式有點類似TF考試，而Course 3 & 4只需要回答問題。只要時間管理得當，7日內可以完成，不必多花錢，這也是為甚麼我會建議先修Udacity的課。

  第四步，嘗試圍繞考核範圍自行找些數據集做練習，可以是上面課程所使用的數據，或者到[TensorFlow Datasets](https://www.tensorflow.org/datasets/catalog/overview#all_datasets)找找看。

  第五步，如果感覺自己對數據處理方面掌握得還不足夠，可以去看看Tensorflow官網[教學課程](https://www.tensorflow.org/tutorials/)的新手部分，內容比Udacity更加新，但要注意當中一些工具並不會在考試中使用。

  第六步，google一下[別人的應考心得](https://www.google.com/search?q=tensorflow+exam+how)。

# 學習重點該聚焦在哪裡

  雖然侯選者手冊上寫了很多要求擁有的技能，事實上我們不必每一項都要練到神級。能夠正確地把資料放入一個設計合理的模型進行訓練，並在驗證中獲得高準確率，這才重要。

  懂得基本的CSV、JSON檔案讀取就足夠，隨便google一下都找得到。`tf.data.Dataset`很好用也值得學習，但不必深入鑽研checklist沒有提及的用法，基本的`.from_tensor_slices()`、`.shuffle()`、`.batch()`等等我覺得就足夠。

  每個訓練好的模型都需要提交到伺服器評分，因此模型的input shape簡單就好，不用想得太複雜，否則input shape可能會對不上。所以，分詞器(subwording tokenizer)、preprocessing layers等checklist一樣沒有提及的數據預處理工具也不必太花心機，跟著Coursera課程的做法就可以。(未科學驗證，勇者請下面留言thx)

  要清楚了解各種Keras Layer的使用方法，Dense、Flatten、Dropout、Conv1D、Conv2D、MaxPool2D、Bidirectional、RNN / LSTM / GRU等。個人感覺GRU在訓練時間和效能平衡之間可以完勝RNN和LSTM，所以後兩者比較少用。

  激活函數(Activation Function) Relu、Sigmoid、Softmax，以及損失函數(Loss) MAE、MSE、BinaryCrossentropy、CategoricalCrossentropy，這些一定要懂得何時使用。優化器(Optimizer) Adam近乎萬能:heart:。

# 考試之前要準備甚麼

  一部載有GPU的電腦用來加速模型訓練，或者Colab / [Colab Pro](https://colab.research.google.com/signup)，這樣才能夠空出更多時間去調整模型。Colab Pro很快很便宜很好用，有人甚至稱此為肥雞餐，但要注意它的服務地區範圍。總之別把一切押注在CPU上，除非你很強。

  下載和更新PyCharm至最新穩定版。

  > 開考前會有一份文件指引你去做些設定。
  >
  > 我人生第一次使用PyCharm也就是在這個考試，所以不用太擔心使用問題。 XD

  喝點可樂，咖啡因有助專注思考。

# 如何訓練出滿分模型

  模型未能滿分不用怕，細心檢查以下各種可能原因：

  1. 輸入問題：看看是不是提取的數據出了錯，數據還未進行數據歸一化(Data Normalization)，或者模型的input shape不是題目所期望的。
  2. 輸出問題：確認一下輸出層的激活函數、損失函數和優化器正確設置。
  3. 訓練時數不足：增加Epochs至100 ~ 1,000不等，當然別忘記要加上`tf.keras.callbacks.EarlyStopping`。
  4. 模型的理解力不夠：嘗試調整模型結構，以及不影響input/output shape的超參數。
  5. 數據不足：Data Augmentation之外，把測試數據集(validation set)也拿去做訓練吧。

# 心得

考試不算困難，要多花點時間調校模型，主要在Colab上訓練，因為能夠反覆調用python區塊很方便。最後，各位加油 :thumbsup:

> 事實上為了那筆匯款，銀行方面收取了我HK$50的手續費，所以才不得不拼命去學習喔 (╯°Д°)╯ ┻━┻
