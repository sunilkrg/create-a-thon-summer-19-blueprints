import tkinter as tk

mainWindow = tk.Tk()
mainWindow.title('Untaught Big Letters')

label_1 = tk.Label(mainWindow, text="\n  Untaught Big Letters  \n", font=("Georgia", 30))
label_1.pack(padx=100, pady=50)


button_1 = tk.Button(mainWindow, text="Student Registration", command=lambda: "", padx=275, pady=25,
                     activebackground='grey', activeforeground='white')
button_1.pack()

button_2 = tk.Button(mainWindow, text="Parent Registration", command=lambda: "", padx=240, pady=25,
                     activebackground='grey', activeforeground='white')
button_2.pack()

button_3 = tk.Button(mainWindow, text="Mentor Registration", command=lambda: "", padx=248, pady=25,
                     activebackground='grey', activeforeground='white')
button_3.pack()

button_4 = tk.Button(mainWindow, text="Login", command=lambda: "", padx=267, pady=25,
                     activebackground='grey', activeforeground='white')
button_4.pack()


label_2 = tk.Label(mainWindow, text="\n")
label_2.pack()


mainWindow.mainloop()
