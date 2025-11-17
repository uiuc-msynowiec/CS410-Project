python .\clean_meta.py meta_Electronics_10000.mini.jsonl > meta_Electronics_10000.mini.cleaned.jsonl
python .\clean_reviews.py Electronics_10000.mini.jsonl > Electronics_10000.mini.cleaned.jsonl

python .\combine_reviews_and_meta.py .\Electronics_10000.mini.cleaned.jsonl .\meta_Electronics_10000.mini.cleaned.jsonl > .\Electronics_combined_10000.jsonl