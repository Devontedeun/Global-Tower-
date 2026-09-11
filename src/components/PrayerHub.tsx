import React, { useState, useEffect } from "react";
import {
  Heart,
  Plus,
  CheckCircle,
  Sparkles,
  Users,
  Search,
  Lock,
  Globe,
  Share2,
  Calendar,
  Filter,
  Shield,
  ShieldAlert,
  MessageCircle,
  BookOpen,
  Send,
  Eye,
  EyeOff,
  AlertCircle,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { CommunityPost, CommunityPostType, UserProfile } from "../types";
import { CommunityService, generateAnonymousIdentifier } from "../lib/communityService";
import { Storage } from "../lib/storage";

interface PrayerHubProps {
  user?: UserProfile;
}

export const PrayerHub: React.FC<PrayerHubProps> = ({ user: propUser }) => {
  const currentUser = propUser || Storage.getUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<CommunityPostType>("prayer_request");
  const [category, setCategory] = useState("Spiritual Warfare & Dominion");
  const [pleasePrayForMe, setPleasePrayForMe] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [previewAnonId, setPreviewAnonId] = useState("");

  // Response form state
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyScripture, setReplyScripture] = useState("");

  const isStaff = ["super_admin", "ministry_admin", "teacher", "moderator"].includes(currentUser.role);

  useEffect(() => {
    // Load community posts
    const initialPosts = CommunityService.getPosts();
    setPosts(initialPosts);
    // Remote fetch in background
    CommunityService.fetchRemotePosts().then((remote) => {
      setPosts(remote);
    });
  }, []);

  useEffect(() => {
    setPreviewAnonId(generateAnonymousIdentifier(postType));
  }, [postType, isAnonymous]);

  const handlePray = async (post: CommunityPost) => {
    const updated = await CommunityService.prayForPost(post.id);
    setPosts(updated);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#C5A059", "#10B981", "#FAF8F5"]
    });
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;

    await CommunityService.createPost(
      {
        title,
        description,
        postType,
        category,
        pleasePrayForMe,
        isAnonymous
      },
      currentUser
    );

    const refreshed = CommunityService.getPosts();
    setPosts(refreshed);
    setTitle("");
    setDescription("");
    setIsCreating(false);

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#C5A059", "#10B981"]
    });
  };

  const handleAddResponse = async (postId: string) => {
    if (!replyMessage.trim()) return;

    const updated = await CommunityService.addPrayerResponse(
      postId,
      replyMessage,
      replyScripture,
      currentUser
    );
    setPosts(updated);
    setReplyMessage("");
    setReplyScripture("");
    setReplyingToPostId(null);
  };

  const filterTabs = [
    { id: "All", label: "All Community Posts" },
    { id: "prayer_request", label: "Prayer Requests" },
    { id: "dream", label: "Dreams & Impressions" },
    { id: "worry", label: "Worries & Burdens" },
    { id: "needs_prayer", label: "Please Pray For Me" }
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesTab =
      activeFilter === "All"
        ? true
        : activeFilter === "needs_prayer"
        ? p.pleasePrayForMe
        : p.postType === activeFilter;

    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.isAnonymous
        ? p.anonymousSystemId.toLowerCase().includes(searchTerm.toLowerCase())
        : p.authorName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div id="prayer-hub-container" className="w-full space-y-6">
      {/* Hero Banner */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span>Intercession & Community Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
              Dreams
            </h1>
            <p className="text-[#7A7468] text-sm mt-1 font-sans max-w-3xl leading-relaxed">
              "Bear one another's burdens, and so fulfill the law of Christ" — Galatians 6:2.
              Share your prayers and dreams with trusted believers. Post openly or anonymously with system-generated IDs.
            </p>
          </div>

          <button
            id="post-community-btn"
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-[#C5A059]/20 transition-all self-start sm:self-center cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? "Cancel" : "Post to Community"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-[28px] border border-[#E5E0D5] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs font-semibold">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#C5A059] text-white font-bold shadow-2xs"
                  : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search posts, prayers, IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
          />
        </div>
      </div>

      {/* Create New Community Post Form */}
      {isCreating && (
        <div className="bg-white border-2 border-[#C5A059]/50 rounded-[32px] p-6 sm:p-8 shadow-md space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Community Fellowship</span>
              <h3 className="font-serif font-bold text-[#2D2D2D] text-lg">Share a Prayer, Dream, or Concern</h3>
            </div>
            <span className="text-xs text-[#8A8478]">Posting as: <strong className="text-[#2D2D2D]">{isAnonymous ? previewAnonId : currentUser.name}</strong></span>
          </div>

          {/* Post Type Selector */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5">Select What You Are Sharing</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
              {[
                { id: "prayer_request" as CommunityPostType, label: "Prayer Request", desc: "Corporate agreement & intercession" },
                { id: "dream" as CommunityPostType, label: "Dream or Spiritual Impression", desc: "Scriptural testing & discernment" },
                { id: "worry" as CommunityPostType, label: "Worry, Burden or Anxiety", desc: "Biblical comfort & prayer support" }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPostType(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    postType === t.id
                      ? "bg-[#FDFCF9] border-[#C5A059] shadow-xs text-[#2D2D2D]"
                      : "bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:bg-white"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{t.label}</span>
                    {postType === t.id && <CheckCircle className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </div>
                  <p className="text-[11px] text-[#8A8478] font-normal mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Title</label>
              <input
                type="text"
                placeholder={
                  postType === "prayer_request"
                    ? "What are we praying for?"
                    : postType === "dream"
                    ? "Brief summary of the dream or impression..."
                    : "What is weighing on your heart?"
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Spiritual Warfare & Dominion">Spiritual Warfare & Dominion</option>
                <option value="Direction & Wisdom">Direction & Wisdom</option>
                <option value="Healing & Health">Healing & Health</option>
                <option value="Family & Marriage">Family & Marriage</option>
                <option value="Global Missions & Outreach">Global Missions & Outreach</option>
                <option value="Faith & Overcoming Worry">Faith & Overcoming Worry</option>
                <option value="General Encouragement">General Encouragement</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Details & Description</label>
            <textarea
              rows={4}
              placeholder="Share the details so pastors and fellow believers can pray with you and offer Scripture-based encouragement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Toggles: "Please Pray For Me" & Anonymous Posting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Please Pray For Me Toggle */}
            <div className="p-4 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  "Please pray for me" Indicator
                </span>
                <p className="text-[11px] text-[#7A7468]">
                  Highlights your post to alert community intercessors and pastors to pray.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPleasePrayForMe(!pleasePrayForMe)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                  pleasePrayForMe ? "bg-[#C5A059]" : "bg-[#D1C9BC]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    pleasePrayForMe ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Anonymous Posting Toggle */}
            <div className="p-4 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                  Post Anonymously
                </span>
                <p className="text-[11px] text-[#7A7468]">
                  Uses system ID: <strong className="text-[#C5A059]">{previewAnonId}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                  isAnonymous ? "bg-[#C5A059]" : "bg-[#D1C9BC]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isAnonymous ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy & Pastoral Care Notice */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] text-[11px] text-[#7A7468] leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#2D2D2D]">Privacy & Moderation Notice: </strong>
              {isAnonymous ? (
                <span>
                  When posting anonymously, regular users only see your generated ID (<strong>{previewAnonId}</strong>). For safety, pastoral care, and community moderation, authorized ministry administrators and pastors can view your linked account.
                </span>
              ) : (
                <span>
                  Your post will be published to the community under your display name (<strong>{currentUser.name}</strong>).
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs text-[#7A7468] hover:text-[#2D2D2D] rounded-full font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-community-post-btn"
              onClick={handleCreate}
              disabled={!title.trim() || !description.trim()}
              className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-pointer transition-all disabled:opacity-50"
            >
              Publish Post
            </button>
          </div>
        </div>
      )}

      {/* Community Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => {
          const isReplying = replyingToPostId === post.id;

          return (
            <div
              key={post.id}
              className={`bg-white border rounded-[28px] p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                post.pleasePrayForMe ? "border-[#C5A059]/40 bg-gradient-to-b from-white to-[#FDFCF9]" : "border-[#E5E0D5] hover:border-[#C5A059]"
              }`}
            >
              <div className="space-y-3">
                {/* Badges & Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#FDFCF9] px-2.5 py-0.5 rounded-full border border-[#E5E0D5]">
                      {post.postType === "prayer_request"
                        ? "Prayer Request"
                        : post.postType === "dream"
                        ? "Dream / Impression"
                        : "Worry / Concern"}
                    </span>

                    <span className="text-[10px] text-[#8A8478] bg-[#F9F7F2] px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  {post.pleasePrayForMe && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse">
                      <Heart className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>Please pray for me</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-[#2D2D2D] text-lg leading-snug">{post.title}</h3>
                <p className="text-xs text-[#7A7468] leading-relaxed font-sans">{post.description}</p>

                {/* Pastoral / Moderator View banner if current user is admin/staff and post is anonymous */}
                {post.isAnonymous && isStaff && (
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                      <span>Pastoral Moderator Audit:</span>
                    </div>
                    <p className="text-[10px] text-blue-800">
                      Author: <strong>{post.authorName}</strong> • Role: {post.authorRole || "member"} (System ID: {post.anonymousSystemId})
                    </p>
                  </div>
                )}

                {/* Prayer / Scripture Responses Thread */}
                {post.prayerResponses && post.prayerResponses.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E5E0D5]/70">
                    <div className="text-[11px] font-bold text-[#2D2D2D] flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Pastoral & Community Responses ({post.prayerResponses.length})</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {post.prayerResponses.map((resp) => (
                        <div
                          key={resp.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            resp.isStaffResponse
                              ? "bg-[#FAF8F5] border-[#C5A059]/40"
                              : "bg-[#F9F7F2] border-[#E5E0D5]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#2D2D2D]">{resp.authorName}</span>
                              {resp.isStaffResponse && (
                                <span className="text-[9px] font-bold bg-[#C5A059] text-white px-1.5 py-0.2 rounded uppercase">
                                  Ministry Staff
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8A8478]">
                              {new Date(resp.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-[#7A7468] leading-relaxed">{resp.message}</p>

                          {resp.scriptureRef && (
                            <div className="text-[11px] font-serif text-[#C5A059] pt-1 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span className="font-bold">{resp.scriptureRef}</span>
                              {resp.scriptureText && <span className="italic text-[#8A8478] truncate"> — "{resp.scriptureText}"</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Response Input Drawer */}
                {isReplying && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#C5A059]/50 rounded-2xl space-y-2 animate-fadeIn text-xs">
                    <span className="font-bold text-[#2D2D2D] block">Encourage with Prayer or Scripture</span>
                    <textarea
                      rows={2}
                      placeholder="Write a prayer of agreement or words of comfort..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <input
                      type="text"
                      placeholder="Optional Scripture Reference (e.g. Philippians 4:6-7)"
                      value={replyScripture}
                      onChange={(e) => setReplyScripture(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setReplyingToPostId(null)}
                        className="px-3 py-1 text-xs text-[#7A7468]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddResponse(post.id)}
                        disabled={!replyMessage.trim()}
                        className="px-4 py-1.5 bg-[#C5A059] text-white font-bold rounded-xl text-xs disabled:opacity-50"
                      >
                        Send Response
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Author & Pray Action */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D5]">
                <div className="flex items-center gap-1.5 text-xs text-[#8A8478]">
                  {post.isAnonymous ? (
                    <div className="flex items-center gap-1 font-semibold text-[#C5A059]">
                      <Lock className="w-3 h-3 text-[#C5A059]" />
                      <span>{post.anonymousSystemId}</span>
                    </div>
                  ) : (
                    <span>
                      Posted by <strong className="text-[#2D2D2D]">{post.authorName}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReplyingToPostId(isReplying ? null : post.id)}
                    className="text-xs text-[#7A7468] hover:text-[#C5A059] font-semibold px-2.5 py-1.5 rounded-xl hover:bg-[#F9F7F2] transition-colors cursor-pointer"
                  >
                    Encourage
                  </button>

                  <button
                    onClick={() => handlePray(post)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      post.hasUserPrayed
                        ? "bg-[#FDFCF9] text-[#C5A059] border border-[#C5A059] shadow-2xs"
                        : "bg-[#C5A059] hover:bg-[#B48F48] text-white shadow-xs"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.hasUserPrayed ? "fill-[#C5A059] text-[#C5A059]" : "fill-white"}`} />
                    <span>{post.prayedCount || 0} Prayed</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
