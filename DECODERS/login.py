
from tkinter import messagebox as ms
import sqlite3
import tkinter as tk
class main:
    def __init__(self):
    	# Window

        # Some Usefull variables
        self.username = ''
        self.password = ''
    def login(self):
        with sqlite3.connect('decoders.db') as db:
            c = db.cursor()

        #Find user If there is any take proper action
        find_user = ('SELECT * FROM student WHERE name = ? and password = ?')
        c.execute(find_user,[(self.username.get()),(self.password.get())])
        result = c.fetchall()
        if result:
            self.logf.pack_forget()
            self.head['text'] = self.username.get() + '\n Loged In'
            self.head['pady'] = 150
        else:
            ms.showerror('Oops!','Username Not Found.')
    def insert():
        add_window = tk.Tk()
        add_window.title("login")
        tk.Label(add_window).grid(row=0, column=0, columnspan=2)
        tk.Label(add_window, text="Name:").grid(row=1, column=0)
        name_entry = tk.Entry(add_window, width=50)
        name_entry.grid(row=1, column=1, padx=25)
        tk.Label(add_window, text="Password:").grid(row=2, column=0)
        class_entry = tk.Entry(add_window, width=50)
        class_entry.grid(row=2, column=1, padx=25)
        tk.Button(add_window, text='login', activebackground='grey', activeforeground='white',command=lambda:login(self)).grid(row=7, column=0, columnspan=2, pady=10)