import React, { useState, useEffect } from "react";
import {
  Bookmark,
  BookOpen,
  FileText,
  Trash2,
  ExternalLink,
  Search,
  MessageCircle
} from "lucide-react";
import { VerseBookmark, StudyNote } from "../types";
import { Storage } from "../lib/storage";

interface MyLibraryProps {
  onNavigateToBible?: (book: string, chapter: number) => void;
  onNavigateToEncouragement?: () => void;
}

export const MyLibrary: React.FC<MyLibraryProps> = ({
  onNavigateToBible,
  onNavigateToEncouragement,
}) => {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "notes">("bookmarks");
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setBookmarks(Storage.getBookmarks());
    setNotes(Storage.getNotes());
  }, []);

  const handleRemoveBookmark = (id: string) => {
    const updated = Storage.removeBookmark(id);
    setBookmarks(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = Storage.deleteNote(id);
    setNotes(updated);
  };

  const filteredBookmarks = bookmarks.filter((b) =>
    !searchTerm.trim() ||
    b.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = notes.filter((n) =>
    !searchTerm.trim() ||
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="my-library-container" className="w-full space-y-6">
      {/* Hero Header */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          <Bookmark className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
          <span>Personal Sanctuary</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
          My Spiritual Library
        </h1>
        <p className="text-[#7A7468] text-sm mt-1 font-sans">
          Access all your bookmarked scriptures, personal reflections, and study notes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-[28px] border border-[#E5E0D5] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "bookmarks", label: `Bookmarked Verses (${bookmarks.length})`, icon: BookOpen },
            { id: "notes", label: `Study Notes (${notes.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#C5A059] text-white shadow-2xs font-bold"
                    : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search saved items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498]"
          />
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === "bookmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookmarks.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-[#E5E0D5] rounded-[32px] p-10 text-center text-[#7A7468]">
              <BookOpen className="w-10 h-10 text-[#C5A059] mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-serif font-bold text-[#2D2D2D]">No Bookmarked Verses</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto mt-1 font-sans">
                Click on any verse in the Bible Hub to bookmark it into your personal library.
              </p>
            </div>
          ) : (
            filteredBookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white border border-[#E5E0D5] rounded-[28px] p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-[#C5A059] text-base">
                    {bm.book} {bm.chapter}:{bm.verseNumber} ({bm.translation})
                  </span>
                  <button
                    onClick={() => handleRemoveBookmark(bm.id)}
                    className="p-1.5 text-[#8A8478] hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <blockquote className="font-serif text-[#2D2D2D] text-xs sm:text-sm italic border-l-2 border-[#C5A059] pl-3.5 leading-relaxed">
                  "{bm.text}"
                </blockquote>
                {onNavigateToBible && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateToBible(bm.book, bm.chapter)}
                      className="text-xs font-bold text-[#C5A059] hover:text-[#B48F48] inline-flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-wider"
                    >
                      <span>Read in Context</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-[#E5E0D5] rounded-[32px] p-10 text-center text-[#7A7468]">
              <FileText className="w-10 h-10 text-[#C5A059] mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-serif font-bold text-[#2D2D2D]">No Study Notes Yet</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto mt-1 font-sans">
                Create personal reflections and cross-references directly beside Scripture passages.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-[#E5E0D5] rounded-[28px] p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[#2D2D2D] text-base">{note.title}</h3>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 text-[#8A8478] hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#2D2D2D] leading-relaxed whitespace-pre-line bg-[#FDFCF9] p-3.5 rounded-xl border border-[#E5E0D5] font-sans">
                  {note.content}
                </p>
                {note.scriptureRef && (
                  <span className="text-[11px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2.5 py-0.5 rounded-full border border-[#E5E0D5] inline-block font-serif">
                    Ref: {note.scriptureRef}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
