/*
import { useState, useRef } from "react"
import { createHabit } from "../api";

export function CreateHabit() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)

  const MAX_FILE_SIZE = 15_000_000
  const inputFile = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return alert("Please attach an image")

    const submitObject = {
      title,
      description,
      content,
      author: null,
      dateCreated: new Date(),
      file: file
    }

    try {
      await createHabit(submitObject)
      // optional: reset form
      setTitle(""); setDescription(""); setContent(""); setFile(null)
      if (inputFile.current) inputFile.current.value = ""
      alert("Habit created")
    } catch (err) {
      console.error("Create habit failed", err.response?.data || err.message)
      alert("Failed to create habit — check console/network")
    }
  }

  function handleFileUpload(e) {
    const picked = e.target.files[0]
    if (!picked) return

    const fileExtension = picked.name.substring(picked.name.lastIndexOf(".")).toLowerCase()
    if (![".jpg", ".jpeg", ".png"].includes(fileExtension)) {
      alert("File must be jpg or png")
      if (inputFile.current) inputFile.current.value = ""
      return
    }
    if (picked.size > MAX_FILE_SIZE) {
      alert("File size exceeds the limit (15 Mb)")
      if (inputFile.current) inputFile.current.value = ""
      return
    }
    setFile(picked)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Habit Title:</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required name="title"/>

      <label>Habit Description:</label>
      <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} required name="description"/>

      <label>Habit Content:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} required name="content"/>

      <label>Insert Habit image:</label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileUpload}
        ref={inputFile}
        required
      />

      <button type="submit">Submit</button>
    </form>
  )
}
  
*/


import { useState, useRef } from "react";
import { createHabit } from "../api";
import { useNavigate } from "react-router-dom";

export function CreateHabit() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const MAX_FILE_SIZE = 15_000_000;
    const inputFile = useRef(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        if (!file) {
            alert("Please attach an image");
            return;
        }

        setIsSubmitting(true);

        const submitObject = {
            title,
            description,
            content,
            author: null,
            dateCreated: new Date(),
            file: file
        };

        try {
            await createHabit(submitObject);
            // Reset form on success
            setTitle(""); 
            setDescription(""); 
            setContent(""); 
            setFile(null);
            if (inputFile.current) inputFile.current.value = "";
            
            // Success feedback and redirect
            alert("Habit created successfully!");
            navigate("/home");
        } catch (err) {
            console.error("Create habit failed", err.response?.data || err.message);
            alert("Failed to create habit – check console/network");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleFileUpload(e) {
        const picked = e.target.files[0];
        processFile(picked);
    }

    function processFile(picked) {
        if (!picked) return;

        const fileExtension = picked.name.substring(picked.name.lastIndexOf(".")).toLowerCase();
        if (![".jpg", ".jpeg", ".png"].includes(fileExtension)) {
            alert("File must be jpg or png");
            if (inputFile.current) inputFile.current.value = "";
            return;
        }
        if (picked.size > MAX_FILE_SIZE) {
            alert("File size exceeds the limit (15 MB)");
            if (inputFile.current) inputFile.current.value = "";
            return;
        }
        setFile(picked);
    }

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create New Habit
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Start building a positive habit that will transform your daily routine
                </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Habit Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            required
                            disabled={isSubmitting}
                            placeholder="e.g., Daily Morning Walk, Read 30 Minutes, Drink 8 Glasses of Water"
                            className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {title.length}/100 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Short Description *
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={200}
                            required
                            disabled={isSubmitting}
                            placeholder="A brief summary of what this habit is about"
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {description.length}/200 characters
                        </p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Detailed Content *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={5000}
                            required
                            rows={8}
                            disabled={isSubmitting}
                            placeholder="Describe your habit in detail:&#10;• Why is this habit important to you?&#10;• How do you plan to implement it?&#10;• What benefits do you expect?&#10;• Any tips or strategies you want to remember?&#10;• What motivates you to stick with this habit?"
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {content.length}/5000 characters
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Habit Image *
                        </label>
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                                dragActive
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                                    : file
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                                ref={inputFile}
                                required
                                disabled={isSubmitting}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            
                            <div className="text-center">
                                {file ? (
                                    <div className="space-y-3">
                                        <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to change or drag a new file here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                <span className="text-purple-600 dark:text-purple-400">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                PNG or JPG up to 15MB
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                                            <span>High quality images work best</span>
                                            <span>•</span>
                                            <span>Recommended: 1200x600px</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title || !description || !content || !file}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Your Habit...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Habit
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tips Section */}
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Tips for Creating Effective Habits
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Start Small</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Begin with tiny, manageable actions that you can easily accomplish every day.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Be Specific</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Define exactly what you'll do, when, and where. Vague goals lead to inconsistent results.</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Stack Habits</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Link your new habit to an existing routine to make it easier to remember.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Track Progress</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Keep a simple record of your daily practice to stay motivated and accountable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}