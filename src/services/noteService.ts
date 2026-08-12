import axios from "axios";
import type { Note } from "../types/note";

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!myKey) {
  console.error('❌ VITE_NOTEHUB_TOKEN is not defined in .env file');
}

type NoteHttpProps = {
  notes: Note[];
  totalPages: number;
};

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NoteHttpProps> => {
  const options = {
    params: { page, perPage: 12, search: search || undefined },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  };

  try {
    const response = await axios.get<NoteHttpProps>("/notes", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes", error);
    throw error;
  }
};

export const createNote = async (noteData: {
  title: string;
  content: string | null;
  tag: string;
}): Promise<Note> => {
  try {
    const response = await axios.post<Note>("/notes", noteData, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note", error);
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

    return response.data;
  } catch (error) {
    console.error("Error deleting note", error);
    throw error;
  }
};