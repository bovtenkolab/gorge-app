use serde::{Serialize, Deserialize};
use url::Url;

#[derive(Serialize, Deserialize, Clone)]
pub struct Link {
    pub id: String,
    pub ownerid: String,
    pub link: String,
    pub primary: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum LinkType {
    Http,
    Https,
    Email,
    LocalFile,
    Unknown,
}

impl LinkRecord {
    pub fn new(id: String, ownerid: String, primary: String) -> Self {
        Self {
            id,
            ownerid,
            link: primary.clone(),
            primary
        }
    }

    pub fn is_valid(&self) -> bool {
        if let Ok(_) = Url::parse(&self.primary) {
            return true;
        }

        // Basic email check
        if self.primary.contains('@') && self.primary.contains('.') {
            return true;
        }

        false
    }

    pub fn link_type(&self) -> LinkType {
        if let Ok(url) = Url::parse(&self.primary) {
            match url.scheme() {
                "http" => LinkType::Http,
                "https" => LinkType::Https,
                "file" => LinkType::LocalFile,
                _ => LinkType::Unknown,
            }
        } else if self.primary.contains('@') {
            LinkType::Email
        } else {
            LinkType::Unknown
        }
    }

    pub fn domain(&self) -> Option<String> {
        if let Ok(url) = Url::parse(&self.primary) {
            return url.domain().map(|d| d.to_string());
        }

        None
    }

    pub fn normalized(&self) -> Option<String> {
        if let Ok(url) = Url::parse(&self.primary) {
            return Some(url.to_string());
        }

        None
    }
}
