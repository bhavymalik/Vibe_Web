import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import Navbar from "./Navbar";
import supabase from "./supabaseClient";

export default function Contacts({ user, setUser }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);
  const pagebtnRef = useRef(null);
  const [list, setList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [contact, setContact] = useState({
    first_name: "",
    last_name: "",
    user: `${user}`,
    contact_email: "",
    address: "",
    bought: "",
  });

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("user", user);

      if (error) {
        console.log("error fetching contacts");
      } else {
        setList(data);
      }
    }

    fetchContacts();
  }, [user]);

  useEffect(() => {
    const rowheight = document.querySelector(".contact-table").offsetHeight;
    pagebtnRef.current.style.top = `${300 + rowheight}px`;
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      console.log("File loaded successfully.");

      const text = e.target.result;
      console.log("File content:", text);

      const { data, errors } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      console.log("Parsed data:", data);

      if (errors.length > 0) {
        console.error("CSV parsing error:", errors);
        return;
      }

      const dataWithEmail = data.map((record) => ({
        ...record,
        user: `${user}`,
      }));

      // Uploading to Supabase
      const { error } = await supabase.from("contacts").insert(dataWithEmail);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        // Update state with new cards if needed
        console.log("Data inserted successfully:", dataWithEmail);
        setList((prevList) => [...prevList, ...dataWithEmail]);
      }
    };

    reader.readAsText(file);
  };

    const handleCheckboxChange = (index) => {
        setSelectedContacts((prevSelectedContacts) => ({
        ...prevSelectedContacts,
        [index]: !prevSelectedContacts[index],
        }));
    };

  // Get current cards
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentList = list.slice(indexOfFirstCard, indexOfLastCard);

  // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
    const totalPages = Math.ceil(list.length / cardsPerPage);

return (
    <div>
      <Navbar setUser={setUser} />
      <div className="contacts-cont">
        <div>
          <input
            type="file"
            accept=".csv"
            id="csvFileInput"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="csvFileInput" className="contact-import">
            Import
          </label>
        </div>

        <button className="contact-new">New</button>

        <table className="contact-table">
          <thead>
            <tr>
              <th className="contact-table-head-cell">S.No</th>
              <th className="contact-table-head-cell">Name</th>
              <th className="contact-table-head-cell">Email</th>
              <th className="contact-table-head-cell">Address</th>
              <th className="contact-table-head-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((obj, index) => (
            <tr key={index}>
                <td className="contact-table-row-cells">
                <div className="contact-table-cell-content">
                <input
                    className="contact-checkbox"
                    type="checkbox"
                    checked={!!selectedContacts[indexOfFirstCard + index]}
                    onChange={() => handleCheckboxChange(indexOfFirstCard + index)}
                />
                {indexOfFirstCard + index + 1}
                </div>
                </td>
                <td className="contact-table-row-cells">{obj.first_name} {obj.last_name}</td>
                <td className="contact-table-row-cells">{obj.contact_email}</td>
                <td className="contact-table-row-cells">{obj.address}</td>
                <td className="contact-table-row-cells">Delete</td>
            </tr>
            ))}
        </tbody>
        </table>

        <div className="pagination" ref={pagebtnRef}>
        <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            First
        </button>
        <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
            <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={currentPage === pageNumber ? "active" : ""}
            >
                {pageNumber}
            </button>
            )
        )}
        <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
        <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
        >
            Last
        </button>
        </div>
    </div>
    </div>
);
}
