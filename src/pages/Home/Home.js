import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ThemeContext } from "../../context/theme.context";
import { AuthContext } from "../../context/auth.context";

import axios from "axios";

import Modal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import AddressBar from "../../components/AddressBar/AddressBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import BusinessCards from "../../components/BusinessCards/BusinessCards";

require("./Home.css");

const Home = () => {
	const API_URL = process.env.REACT_APP_API_URL;

	const navigate = useNavigate();

	const { theme } = useContext(ThemeContext);
	const { user } = useContext(AuthContext);

	const [searchItem, setSearchItem] = useState("");
	const [address, setAddress] = useState(
		localStorage.getItem("address") ? localStorage.getItem("address") : ""
	);
	const [addressActive, setAddressActive] = useState("");
	const [businesses, setBusinesses] = useState(null);
	const [searchErr, setSearchErr] = useState("");
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState("");

	const [showModal, setShowModal] = useState("");

	const handleSearchItem = (e) => {
		setSearchItem(e.target.value);
	};

	const handleAddress = (e) => {
		setAddress(e.target.value);
	};

	const toggleAddress = () => {
		if (addressActive === "") {
			setAddressActive("active");
		} else {
			setAddressActive("");
		}
	};

	const handleSearch = () => {
		if (!localStorage.getItem("address") || address === "") {
			setAddressActive("active error");
		} else if (searchItem === "") {
			setSearchErr("error");
		} else {
			setAddressActive("");
			navigate(`/search/${searchItem}`);
		}
	};

	useEffect(() => {
		setLoading(true);

		axios
			.post(`${API_URL}/search`, {
				searchItem: "",
				address: "USA",
			})
			.then((response) => {
				setLoading(false);
				localStorage.setItem(
					"businesses",
					JSON.stringify(response.data.businesses)
				);
				setBusinesses(response.data.businesses);
			})
			.catch(() => {
				setErr("something went wrong");
			});
	}, []);
	console.log(user);
	return (
		<div className={"home page " + theme + " " + showModal}>
			<Navbar />

			{showModal === "show-modal" && <Modal setShowModal={setShowModal} />}

			<SearchBar
				searchItem={searchItem}
				setSearchItem={setSearchItem}
				toggleAddress={toggleAddress}
				handleSearch={handleSearch}
				handleSearchItem={handleSearchItem}
				searchErr={searchErr}
			/>
			<AddressBar
				address={address}
				setAddress={setAddress}
				handleAddress={handleAddress}
				addressActive={addressActive}
			/>

			{businesses && !loading && (
				<BusinessCards
					businesses={businesses}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}

			{loading && <p>LOADING......</p>}
			{err && <p>{err}</p>}
		</div>
	);
};

export default Home;
