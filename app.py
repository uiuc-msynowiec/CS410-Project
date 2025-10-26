import streamlit as st

st.set_page_config(
    page_title="Search Page",
    page_icon="🛒",
    layout="centered",
    initial_sidebar_state="collapsed"
)
#so this sets initial states and titles, etc. Couple other possible vars, like in html setup

#essentially the css
st.markdown("""
    <style>
    body, .stApp {
        background-color: #121212;
        color: #E0E0E0;
    }

    h1 {
        text-align: center;
        color: #4FC3F7;
        font-family: "Segoe UI", sans-serif;
        font-weight: 600;
        margin-bottom: 0.8em;
    }

    input[type="text"] {
        background-color: #1E1E1E !important;
        color: #E0E0E0 !important;
        border: 1px solid #444 !important;
        border-radius: 8px !important;
        padding: 10px !important;
        font-size: 16px !important;
        width: 100% !important;
    }

    div.stButton > button:first-child {
        background-color: #4FC3F7;
        color: black;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        font-size: 16px;
        padding: 0.5em 1em;
        width: 100%;
        margin-top: 10px;
    }

    div.stButton > button:hover {
        background-color: #81D4FA;
        color: black;
    }

    .centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }
    </style>
""", unsafe_allow_html=True)

st.markdown("<h1>Search</h1>", unsafe_allow_html=True)
st.markdown('<div class="centered">', unsafe_allow_html=True)

#search box and button
st.markdown("""
    <div class="centered">
        <form action="#" method="get" class="search-bar">
            <input type="text" name="query" placeholder="Search products..." id="searchBox">
            <button type="submit" id="searchButton">🔍</button>
        </form>
    </div>

    <style>
    .search-bar {
        display: flex;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }
    .search-bar input {
        flex-grow: 1;
        padding: 10px 14px;
        border: 1px solid #444;
        border-radius: 8px 0 0 8px;
        background-color: #1E1E1E;
        color: #E0E0E0;
        font-size: 16px;
        outline: none;
    }
    .search-bar button {
        background-color: #4FC3F7;
        color: black;
        border: none;
        border-radius: 0 8px 8px 0;
        font-weight: 600;
        font-size: 16px;
        padding: 0 20px;
        cursor: pointer;
    }
    .search-bar button:hover {
        background-color: #81D4FA;
    }
    </style>
""", unsafe_allow_html=True)


st.markdown('</div>', unsafe_allow_html=True)
