# AI DIAL Chat Localization

The application uses next-i18next and has resource files in the public/locales directory.
To change any text on the UI, add a "key": "value" formatted value to the corresponding file (divided by areas), where the current UI text serves as the key (all text displayed on the UI is translated through next-i18next, based on the principle "the resource value is displayed if it exists, otherwise the key as it is").
Example:
"New conversation": "New topic"