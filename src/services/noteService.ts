
import axios from "axios";
import type { Note } from "../types/note";
import toast from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

type NoteHttpProps = {
  notes: Note[];
  totalPages: number;
};

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";

const fetchNotes = async (
  page: number,
  search: string
): Promise<NoteHttpProps> => {
  const options = {
    params: { page, perPage: 12, search },
    method: "GET",
    headers: {
      accept: "applications/json",
      Authorization: `Bearer ${myKey}`,
    },
  };

  try {
    const response = await axios.get<NoteHttpProps>("notes", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes", error);
    throw error;
  }
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  try {
    const response = await axios.post<Note>("notes", noteData, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
        "Content-Type": "application/json",
      },
    });
    toast.success("Note added successfully!");
    return response.data;
  } catch (error) {
    toast.error("Error getching notes");
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.delete<Note>(`/notes/${id}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
      },
    });

    toast.success("Note deleted successfully!");
    return response.data;
  } catch (error) {
    toast.error("Error deleting note");
    throw error;
  }
};

export const useFetchNotes = (currentPage: number, search: string) => {
  return useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};