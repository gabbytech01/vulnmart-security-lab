#!/usr/bin/env python3

import re
import sys
from collections import Counter
from pathlib import Path


def analyse_log(filename: str) -> int:
    path = Path(filename)

    if not path.is_file():
        print(f"Error: log file not found: {filename}")
        return 1

    failed = 0
    successful = 0
    failed_ips = Counter()

    for line_number, line in enumerate(path.read_text(errors="replace").splitlines(), start=1):
        if "Failed password" in line:
            failed += 1
            match = re.search(r"from (\d{1,3}(?:\.\d{1,3}){3})", line)
            if match:
                failed_ips[match.group(1)] += 1
        elif "Accepted" in line:
            successful += 1

    print(f"Log file: {filename}")
    print(f"Failed authentication events: {failed}")
    print(f"Successful authentication events: {successful}")
    print("Failed-attempt source IPs:")

    if failed_ips:
        for ip, count in failed_ips.most_common():
            print(f"  {ip}: {count}")
    else:
        print("  None found")

    return 0


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} LOG_FILE")
        return 2
    return analyse_log(sys.argv[1])


if __name__ == "__main__":
    raise SystemExit(main())

