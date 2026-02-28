"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ClubType = {
  clubToStudents: {
    clubId: string;
    id: string;
    Student: {
      clerkId: string;
      email: string;
      firstname: string;
      id: string;
      lastname: string;
      phone: string;
      profilePic: string;
    };
  }[];
  code: string;
  id: string;
  name: string;
  presidentId: string;
  createdAt: string;
  description: string;
  events: {
    capacity: number;
    clubId: string;
    createdAt: string;
    description: string;
    endingAt: Date;
    startingAt: Date;
    eventId: string;
    location: string;
    onlineLink: string;
    title: string;
    status: string;
  }[];
};

type PostType = {
  clubId: string;
  content: string;
  createdAt: string;
  id: string;
  image: string[];
  status: string;
  studentId: string;
  title: string;
  updatedAt: string;
};

const Page = () => {
  const params = useParams();
  const clubId = params.clubId as string;
  const [club, setClub] = useState<ClubType | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [caption, setCaption] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<PostType[] | []>([]);

  useEffect(() => {
    if (!clubId || !user) return;
    const fetchData = async () => {
      const res = await fetch(`/api/club-management/bring-club-info/${clubId}`);

      if (res.ok) {
        const data = await res.json();
        setClub(data);
      } else {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [isLoaded, user, clubId]);

  const formatEventDate = (eventDate: string) => {
    const d = new Date(eventDate);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} 🕒 ${hours}:${minutes}`;
  };

  const fetchFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handlecap = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handledef = (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value);
  };

  const CreatePost = async () => {
    const res = await fetch("/api/club-management/create-post", {
      method: "POST",
      body: JSON.stringify({
        clubId: club?.id,
        title: caption,
        content: details,
        studentClerk: user?.id,
        image: image,
      }),
    });

    if (res.ok) {
      toast.success("Successfully created post");
      setCaption("");
      setDetails("");
      setFile(null);
      setImage("");
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    if (!clubId || !user) return;

    const BringPost = async () => {
      const res = await fetch(`/api/club-management/bring-posts/${club?.id}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        toast.error("Somehting went wrong, refresh page");
      }
    };

    BringPost;
  }, [user, clubId, isLoaded]);
  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Club Header */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {club?.name}
              </h1>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-blue-100 text-blue-700 text-xs font-medium shadow-sm select-none"
              aria-label="Club Member Badge"
            >
              Member
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {club?.description || "No description provided."}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Members</p>
              <p className="text-lg font-semibold text-gray-900">
                {club?.clubToStudents?.length || 0}
              </p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-semibold text-blue-600">Member</p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-semibold text-green-600">Active</p>
            </div>
          </div>
        </section>

        {/* Members */}
        <section className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Members</h2>

          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {club?.clubToStudents?.map((el, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md"
                >
                  <div className="relative rounded-full border-2 border-blue-400 p-0.5">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          el?.Student?.profilePic ||
                          "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>
                        {el?.Student?.firstname?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-sm font-medium text-gray-900">
                    {el?.Student?.firstname || "-"}{" "}
                    <span className="text-gray-500 font-normal">
                      {el?.Student?.clerkId === user?.id
                        ? "You"
                        : el?.Student?.lastname || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Overview */}
        <section className="mt-6">
          <div className="py-3 px-6 bg-white rounded-lg shadow-sm w-full sm:w-fit">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-500 text-sm font-semibold">
                Events Overview
              </div>
            </div>

            <div className="flex space-x-4 mb-3 border-b border-gray-200">
              <button className="pb-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                Upcoming
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {club?.events
                ?.filter((event) => event.status === "NEW")
                .map((event) => (
                  <div
                    key={event.eventId}
                    className="p-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {event.title}
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          📍 <span>{event.location}</span>
                        </span>
                      )}
                      {event.startingAt && (
                        <span className="flex items-center gap-1">
                          📅{" "}
                          <span>
                            {formatEventDate(event.startingAt.toString())}
                          </span>
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}

              {!club?.events?.some((event) => event.status === "NEW") && (
                <div className="text-gray-400 text-sm">No upcoming events</div>
              )}
            </div>
          </div>
        </section>
        <section className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 max-w-sm">
            <p className="text-sm text-gray-600 leading-relaxed">
              Club events and announcements are managed by the president. You’ll
              be notified when new updates are available.
            </p>
          </div>
        </section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Club Posts</h2>
        <section className="mt-6 flex flex-col md:flex-row gap-4">
          <section className="max-w-md p-6 bg-white rounded-lg shadow-md space-y-4">
            <div className="text-xl font-semibold">Create new post</div>

            <input
              placeholder="Enter Caption..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                handlecap(e);
              }}
            />

            <input
              placeholder="Enter post details..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-fit text-wrap"
              onChange={(e) => {
                handledef(e);
              }}
            />

            <label
              htmlFor="image-upload"
              className="block w-full cursor-pointer rounded-md border border-dashed border-gray-400 py-12 text-center text-gray-400 hover:border-blue-500 hover:text-blue-600 transition"
            >
              Click to upload image
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={fetchFile}
              />
            </label>

            <div className="w-full h-64 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-gray-400">
                  Image preview will appear here
                </span>
              )}
            </div>
            <button
              onClick={() => {
                CreatePost();
              }}
              className="bg-white text-gray-800 border border-gray-300 rounded-md px-6 py-1 text-sm hover:bg-gray-100 transition-colors"
            >
              Post
            </button>
          </section>
          <section className="flex-1 max-h-[600px] overflow-y-auto bg-white border border-gray-200 rounded-md p-4">
            {posts?.length ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-gray-900 font-semibold mb-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">{post.content}</p>
                  <div className="flex items-center">
                    <div className="text-gray-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>

                    <button className="ml-3 text-gray-600 text-xs hover:text-gray-900 transition-colors">
                      💬 Comment
                    </button>

                    {post?.studentId === club?.presidentId && (
                      <div className="text-gray-700 text-[12px] text-green-600 font-semibold mb-1 ml-3">
                        President
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No posts available.</p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default Page;
