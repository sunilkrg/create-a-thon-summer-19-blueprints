import tkinter as tk
import sqlite3
from tkinter import ttk, messagebox

con = sqlite3.connect("decoders.db")
con.execute("CREATE TABLE IF NOT EXISTS student(name TEXT, class TEXT, age INTEGER, dob TEXT, school, pass TEXT);")


def insert_data(name, cls, age, dob, school, passwd):
    conn = sqlite3.connect("decoders.db")
    conn.execute("INSERT INTO student(name, class, age, dob, school, pass) VALUES( '" + name + "', '" + cls +
                 "', '" + age + "', '" + dob + "', '" + school + "', '" + passwd + "' );")
    conn.commit()
    conn.close()
    messagebox.showinfo("Success", "Data Saved Successfully.")


def insert():
    add_window = tk.Tk()
    add_window.title("Student Registration")
    tk.Label(add_window).grid(row=0, column=0, columnspan=2)
    tk.Label(add_window, text="Name:").grid(row=1, column=0)
    name_entry = tk.Entry(add_window, width=50)
    name_entry.grid(row=1, column=1, padx=25)
    tk.Label(add_window, text="Class:").grid(row=2, column=0)
    class_entry = tk.Entry(add_window, width=50)
    class_entry.grid(row=2, column=1, padx=25)
    tk.Label(add_window, text="Age:").grid(row=3, column=0)
    age_entry = tk.Entry(add_window, width=50)
    age_entry.grid(row=3, column=1, padx=25)
    tk.Label(add_window, text="Date of Birth:").grid(row=4, column=0, padx=20)
    dob_entry = tk.Entry(add_window, width=50)
    dob_entry.grid(row=4, column=1, padx=25)
    tk.Label(add_window, text="School:").grid(row=5, column=0)
    school_entry = tk.Entry(add_window, width=50)
    school_entry.grid(row=5, column=1, padx=25)
    tk.Label(add_window, text="Password:").grid(row=6, column=0)
    password_entry = tk.Entry(add_window, width=50)
    password_entry.grid(row=6, column=1, padx=25)
    tk.Button(add_window, text='Submit', activebackground='grey', activeforeground='white', command=lambda: submit()).grid(row=7, column=0, columnspan=2, pady=10)

    def submit():
        name = name_entry.get()
        cls = class_entry.get()
        age = age_entry.get()
        dob = dob_entry.get()
        school = school_entry.get()
        passwd = password_entry.get()
        insert_data(name, cls, age, dob, school, passwd)
        add_window.destroy()

    add_window.mainloop()

con.close()