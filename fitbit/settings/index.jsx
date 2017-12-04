function AppSettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Refuel Settings</Text>}>
          <TextInput
          label="Server Url"
          settingsKey="baseurl"
        />
        <TextInput
          label="Access Key"
          settingsKey="accesskey"
        />
      </Section>
      <Section
         title={<Text align="center">Mock Locations</Text>}>
        <Toggle
          settingsKey="mockloc"
          label="Enable Mock Location"
          
        />
        <TextInput
          settingsKey="mocklat"
          label="Latitude"          
        />
        <TextInput
          settingsKey="mocklong"
          label="Longitude"      
        />
      </Section>
      <Section title={<Text align="center">Mock Data</Text>}>
        <Toggle
          settingsKey="mockdata"
          label="Mock Data"
        />
        <TextInput
          settingsKey="mockTimeout"
          label="Mock waiting time"      
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(AppSettings);