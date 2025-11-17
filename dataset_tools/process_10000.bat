python .\mini.py .\meta_Electronics.jsonl 10000 > meta_Electronics_10000.mini.jsonl
python .\print_entry.py parent_asin .\meta_Electronics_10000.mini.jsonl > parent_asin_list_10000.txt
python .\read_based_on_entrylist.py parent_asin .\parent_asin_list_10000.txt .\Electronics.jsonl > Electronics_10000.mini.jsonl
