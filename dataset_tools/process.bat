python .\mini.py .\meta_Electronics.jsonl 1000 > meta_Electronics.mini.jsonl
python .\print_entry.py parent_asin .\meta_Electronics.mini.jsonl > parent_asin_list.txt
python .\read_based_on_entrylist.py parent_asin .\parent_asin_list.txt .\Electronics.jsonl > Electronics.mini.jsonl
