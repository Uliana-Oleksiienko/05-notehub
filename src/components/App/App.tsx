import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import { useFetchNotes } from "../../hooks/useNotes"; // ← з hooks!
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");

  const [debouncedSearch] = useDebounce(rawSearch, 300);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawSearch(event.target.value);
    setCurrentPage(1);
  };

  const { data, isSuccess, isLoading, isError } = useFetchNotes(
    currentPage,
    debouncedSearch
  );

  useEffect(() => {
    if (
      isSuccess &&
      data &&
      Array.isArray(data.notes) &&
      data.notes.length === 0
    ) {
      toast.error("No notes found.");
    }
  }, [isSuccess, data]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />
        
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      
      {data && Array.isArray(data.notes) && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}
      
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      
      <Toaster />
    </div>
  );
}