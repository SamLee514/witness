import csv
import pickle
from datetime import datetime, timedelta
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
with open(f"{dir_path}/sol.dump", "rb") as f:
    sessions = pickle.load(f)

with open(f"{dir_path}/teams.txt") as f:
    TEAMS = f.read().splitlines()

JUDGES = [
    "Aleksandr Zakharov",
    "hafiz",
    "Gayathri Narasimham",
    "Effat Farhana",
    "Uttam Ghosh",
    "Thilo Womelsdorf",
    "Aniruddha Gokhale",
    "Md Kamrul Hasan",
    "John Beck",
    "Douglas Schmidt",
    "Robert McLaurine",
    "Roman",
    "Seth Strong",
]

TZ_EXTRA = " (Central Standard Time)"
START_TIME = "Sun Oct 10 2021 10:10:00 GMT-0500"

TIME_DELTA_10 = timedelta(minutes=10)
TIME_FMT = "%a %b %d %Y %H:%M:%S %Z%z"
START_TIME = datetime.strptime(START_TIME, TIME_FMT)


fields = ["Time", "Zoom", "Judge1", "Judge2", "Judge3", "TeamName"]

with open(f"{dir_path}/output.csv", "w", newline="", encoding="utf8") as f:
    writer = csv.writer(f)
    writer.writerow(fields)

    team_num = 0
    time = START_TIME
    done = False
    for session_num, session in enumerate(sessions):
        if session_num == len(sessions) // 2:
            pass #time += TIME_DELTA_10  # Add to account for the break
        for i, triplet in enumerate(session):
            judge_names = [JUDGES[i] for i in triplet]
            if team_num >= len(TEAMS):
                done = True
                break
            line = [datetime.strftime(time, TIME_FMT) + TZ_EXTRA, f"https://vhl.ink/room-{i+1}", *judge_names, TEAMS[team_num]]
            writer.writerow(line)
            team_num += 1
        time += TIME_DELTA_10
        if done:
            break

if team_num < len(TEAMS):
    print("Not all teams being judged")
