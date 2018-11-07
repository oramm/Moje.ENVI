class ExternalAchievementModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        this.roleNames = ['Kierownik Projektu - Inżynier Rezydent',
                          'Inspektor Nadzoru - Sanitarny',
                          'Inspektor Nadzoru - Drogowiec',
                          'Inspektor Nadzoru - Konstruktor',
                          'Inspektor Nadzoru - Konstruktor',
                          'Inspektor Nadzoru - Elektryk',
                          'Inspektor Nadzoru - AKPiA, automatyk',
                          'Inspektor Nadzoru - Telekomunikacyjny',
                          'Rozliczeniowiec - Roboty',
                          'Kierownik Robót/budowy - Sanitarny',
                          'Kierownik Robót/budowy - Drogowiec',
                          'Kierownik Robót/budowy - Konstruktor',
                          'Kierownik Robót/budowy - Elektryk',
                          'Kierownik Robót/budowy - AKPiA',
                          'Kierownik Robót/budowy - Telekomunikacyjny',
                          'Rozliczeniowiec - wnioski o płatność, dotacje',
                          'Analityk finansowy',
                          'Architekt',
                          'Ekspert Pzp',
                          'Szkoleniowiec',
                          'Radca Prawny',
                          'Archeolog'
        ];
        
        this.ownerAutoCompleteTextField = new AutoCompleteTextField(this.id+'ownerAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     true, 
                                                                     'Wybierz imię i nazwisko')
        this.ownerAutoCompleteTextField.initialise(personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        this.roleSelectField = new SelectField(this.id + 'roleSelectField', 'Pełniona rola', true);
        this.roleSelectField.initialise(this.roleNames);
        this.descriptionReachTextArea = new ReachTextArea (this.id + 'descriptionReachTextArea','Wykonywane czynności', true, 500);
        this.worksScopeReachTextArea = new ReachTextArea (this.id + 'worksScopeReachTextArea','Opis robót, których dotyczy doświadczenie', true, 800);
        
        this.startDatePicker = new DatePicker(this.id + 'startDatePickerField','Początek', true);
        this.endDatePicker = new DatePicker(this.id + 'endDatePickerField','Koniec', true);
        
        this.formElements = [
            this.ownerAutoCompleteTextField,
            this.roleSelectField,
            this.descriptionReachTextArea,
            this.worksScopeReachTextArea,
            new InputTextField (this.id + 'worksValueTextField','Wartość obsługiwanych robót', undefined,  true, 20),
            new InputTextField (this.id + 'projectValueTextField','Wartość całego projektu', undefined, true, 50),
            this.startDatePicker,
            this.endDatePicker,
            FormTools.createTextArea(this.id + 'employerTextArea','Zamawiający', true, 300)
        ];        
        this.initialise();
    }
    
    fillWithData(){
        this.form.fillWithData([
            this.connectedResultsetComponent.connectedRepository.currentItem.ownerNameSurnameEmail,
            this.connectedResultsetComponent.connectedRepository.currentItem.roleName,
            this.connectedResultsetComponent.connectedRepository.currentItem.description,
            this.connectedResultsetComponent.connectedRepository.currentItem.worksScope,
            this.connectedResultsetComponent.connectedRepository.currentItem.worksValue,
            this.connectedResultsetComponent.connectedRepository.currentItem.projectValue,
            this.connectedResultsetComponent.connectedRepository.currentItem.startDate,
            this.connectedResultsetComponent.connectedRepository.currentItem.endDate,
            this.connectedResultsetComponent.connectedRepository.currentItem.employer
        ]);
        //this.$formElements[8].children('input').trigger('autoresize');//do przetestowania
        //this.$formElements[8].children('input').val(externalAchievementsRepository.currentItem.employer);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        tinyMCE.triggerSave();
        this.dataObject = { chosenOwner: '',
                            roleName: '',
                            description: '',
                            worksScope: '',
                            worksValue: '',
                            projectValue: '',
                            startDate: '',
                            endDate: '',
                            employer: ''
                          };
        this.form.submitHandler(this.dataObject);
        if (this.form.validate(this.dataObject)){
            
            this.dataObject.ownerNameSurnameEmail = this.dataObject.chosenOwner.nameSurnameEmail;
            this.dataObject.ownerId = this.dataObject.chosenOwner.id;   
        }
    }
};