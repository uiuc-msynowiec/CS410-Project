python .\clean_meta.py meta_Electronics.mini.jsonl > meta_Electronics.mini.cleaned.jsonl
python .\clean_reviews.py Electronics.mini.jsonl > Electronics.mini.cleaned.jsonl

python .\combine_reviews_and_meta.py .\Electronics.mini.cleaned.jsonl .\meta_Electronics.mini.cleaned.jsonl > .\Electronics_combined.jsonl