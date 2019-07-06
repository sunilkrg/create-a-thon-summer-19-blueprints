import tkinter as tk
import sqlite3
from tkinter import ttk, messagebox

con = sqlite3.connect("decoders.db")
con.execute("CREATE TABLE IF NOT EXISTS parent(name TEXT, age INTEGER, occupation TEXT, mobile INTEGER, pass TEXT);")


def insert_data(name, age, occupation, mobile, passwd):
    conn = sqlite3.connect("decoders.db")
    conn.execute("INSERT INTO parent(name, age, occupation, mobile, pass) VALUES( '" + name +
                 "', '" + age + "', '" + occupation + "', '" + mobile + "', '" + passwd + "' );")
    conn.commit()
    conn.close()
    messagebox.showinfo("Success", "Data Saved Successfully.")


def insert():
    add_window = tk.Tk()
    add_window.title("Parent Registration")
    tk.Label(add_window).grid(row=0, column=0, columnspan=2)
    tk.Label(add_window, text="Name:").grid(row=1, column=0)
    name_entry = tk.Entry(add_window, width=50)
    name_entry.grid(row=1, column=1, padx=25)
    tk.Label(add_window, text="Age:").grid(row=2, column=0)
    age_entry = tk.Entry(add_window, width=50)
    age_entry.grid(row=2, column=1, padx=25)
    tk.Label(add_window, text="Occupation:").grid(row=3, column=0, padx=20)
    occ_entry = tk.Entry(add_window, width=50)
    occ_entry.grid(row=3, column=1, padx=25)
    tk.Label(add_window, text="Mobile:").grid(row=4, column=0)
    mob_entry = tk.Entry(add_window, width=50)
    mob_entry.grid(row=4, column=1, padx=25)
    tk.Label(add_window, text="Password:").grid(row=5, column=0)
    password_entry = tk.Entry(add_window, width=50)
    password_entry.grid(row=5, column=1, padx=25)
    tk.Button(add_window, text='Submit', activebackground='grey', activeforeground='white', command=lambda: submit()).grid(row=6, column=0, columnspan=2, pady=10)

    def submit():
        name = name_entry.get()
        age = age_entry.get()
        occ = occ_entry.get()
        mob = mob_entry.get()
        passwd = password_entry.get()
        insert_data(name, age, occ, mob, passwd)
        add_window.destroy()

    add_window.mainloop()

con.close()